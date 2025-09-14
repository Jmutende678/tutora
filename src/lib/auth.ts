import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  company_id: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      id: string;
      email: string;
      company_id: string;
      role: string;
    };
    return {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name || '',
      company_id: decoded.company_id,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string } | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, password_hash, company_id, role, status')
      .eq('email', credentials.email.toLowerCase())
      .single();

    if (error || !user) {
      return null;
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    const isValidPassword = await verifyPassword(credentials.password, user.password_hash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Track login activity
    await trackActivity(user.id, user.company_id, 'login', 'User logged in');

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_id: user.company_id,
      role: user.role
    };

    const token = generateToken(authUser);

    return { user: authUser, token };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Register user
export async function registerUser(data: RegisterData): Promise<{ user: AuthUser; token: string } | null> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email.toLowerCase())
      .single();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create or get company
    let companyId: string;
    
    if (data.company_name) {
      // Create new company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.company_name,
          plan: 'starter'
        })
        .select()
        .single();

      if (companyError) {
        throw new Error('Failed to create company');
      }
      companyId = company.id;
    } else {
      // Use demo company for now
      const { data: demoCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('domain', 'demo.com')
        .single();
      
      companyId = demoCompany?.id || '';
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: data.email.toLowerCase(),
        full_name: data.full_name,
        password_hash: passwordHash,
        company_id: companyId,
        role: data.company_name ? 'admin' : 'user',
        status: 'active'
      })
      .select()
      .single();

    if (userError) {
      throw new Error('Failed to create user');
    }

    // Track signup activity
    await trackActivity(user.id, companyId, 'signup', 'User registered');

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_id: user.company_id,
      role: user.role
    };

    const token = generateToken(authUser);

    return { user: authUser, token };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

// Track user activity
export async function trackActivity(
  userId: string, 
  companyId: string, 
  activityType: string, 
  details: string,
  metadata?: Record<string, unknown>
) {
  try {
    await supabase
      .from('activities')
      .insert({
        user_id: userId,
        company_id: companyId,
        activity_type: activityType,
        details: details,
        metadata: metadata || {}
      });
  } catch (error) {
    console.error('Activity tracking error:', error);
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, company_id, role')
      .eq('id', userId)
      .eq('status', 'active')
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Middleware helper to extract user from request
export function extractUserFromRequest(request: Request): AuthUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}
