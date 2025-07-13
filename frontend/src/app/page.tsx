export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          ESG Platform
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-environmental text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Environmental</h2>
            <p>Track your environmental impact and sustainability metrics</p>
          </div>
          <div className="bg-social text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Social</h2>
            <p>Measure social responsibility and employee engagement</p>
          </div>
          <div className="bg-governance text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Governance</h2>
            <p>Ensure compliance and ethical business practices</p>
          </div>
        </div>
      </div>
    </main>
  );
} 