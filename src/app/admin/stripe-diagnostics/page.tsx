'use client'

import React, { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { CheckCircle, AlertTriangle, RefreshCw, Zap, DollarSign, Package } from 'lucide-react'

export default function StripeDiagnosticsPage() {
  const [diagnosticResults, setDiagnosticResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError('')
    setDiagnosticResults(null)

    try {
      const response = await fetch('/api/stripe/fix-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok) {
        setDiagnosticResults(result)
      } else {
        setError(result.error || 'Failed to run diagnostics')
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const createActiveProducts = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-active-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ Success! Created ${result.products.length} products and ${result.prices.length} prices.\n\nNext step: Update src/lib/stripe.ts with the new price IDs:\n\n${result.updateInstructions}`)
        // Refresh diagnostics
        await runDiagnostics()
      } else {
        setError(result.error || 'Failed to create products')
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-4 h-4" />
              <span>Stripe Diagnostics</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Stripe Payment Diagnostics
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Diagnose and fix Stripe pricing issues. Use this tool to identify inactive products and create new active ones.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Issue</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Payment Error</h3>
                  <p className="text-red-700 text-sm mt-1">
                    Error: Price `price_1S529e3aA9p13T3HurTMrkPc` is not available to be purchased because its product is not active.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={runDiagnostics}
                disabled={isLoading}
                className="flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
                <span>Run Diagnostics</span>
              </button>

              <button
                onClick={createActiveProducts}
                disabled={isLoading}
                className="flex items-center justify-center space-x-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                <span>Create Active Products</span>
              </button>
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {diagnosticResults && (
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Diagnostic Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Products Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Products:</span>
                      <span className="font-semibold text-blue-900">{diagnosticResults.summary.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Active Products:</span>
                      <span className="font-semibold text-blue-900">{diagnosticResults.summary.activeProducts}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Prices Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Prices:</span>
                      <span className="font-semibold text-green-900">{diagnosticResults.summary.totalPrices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Active Prices:</span>
                      <span className="font-semibold text-green-900">{diagnosticResults.summary.activePrices}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Problematic Price Status</h3>
                <div className={`rounded-lg p-4 ${diagnosticResults.summary.problematicPriceFound 
                  ? (diagnosticResults.summary.problematicPriceActive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200')
                  : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {diagnosticResults.summary.problematicPriceFound ? (
                      diagnosticResults.summary.problematicPriceActive ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-gray-600" />
                    )}
                    <span className={`font-medium ${
                      diagnosticResults.summary.problematicPriceFound 
                        ? (diagnosticResults.summary.problematicPriceActive ? 'text-green-800' : 'text-red-800')
                        : 'text-gray-800'
                    }`}>
                      Price `price_1S529e3aA9p13T3HurTMrkPc`: {
                        diagnosticResults.summary.problematicPriceFound 
                          ? (diagnosticResults.summary.problematicPriceActive ? 'Active ✅' : 'Inactive ❌')
                          : 'Not Found'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {diagnosticResults.activeProducts && diagnosticResults.activeProducts.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">Active Products</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid gap-2">
                      {diagnosticResults.activeProducts.map((product, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-gray-600">{product.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {diagnosticResults.activePrices && diagnosticResults.activePrices.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Active Prices</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid gap-2">
                      {diagnosticResults.activePrices.map((price, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <span className="font-medium">
                            {price.currency.toUpperCase()} {(price.unit_amount / 100).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-600">{price.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Run diagnostics to identify the current state of your Stripe products and prices</li>
              <li>If products are inactive, use "Create Active Products" to generate new ones</li>
              <li>Update <code className="bg-blue-100 px-2 py-1 rounded">src/lib/stripe.ts</code> with the new price IDs</li>
              <li>Test the pricing page to ensure payments work correctly</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
