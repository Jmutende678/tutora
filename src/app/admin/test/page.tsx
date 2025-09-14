export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Admin Route Test</h1>
        <p className="text-gray-700">If you can see this, admin routes are working!</p>
        <p className="text-sm text-gray-500 mt-4">
          Now try: <strong>/admin/live-activity</strong>
        </p>
      </div>
    </div>
  )
}
