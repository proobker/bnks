export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl mb-6 tracking-tight">
              EduFit Nepal
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              A decision intelligence platform that helps schools avoid failed
              EdTech investments by analyzing their environment, student accessibility,
              and readiness before recommending educational technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/assessment"
                className="px-6 py-3 bg-primary text-white rounded-lg shadow-primary hover:bg-primary-hover text-lg font-medium transition-colors"
              >
                Start School Assessment
              </a>
              <a
                href="/student"
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary-soft text-lg font-medium transition-colors"
              >
                Take Student Survey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            How EduFit Works
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center p-6">
              <div className="mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft">
                  <span className="text-primary text-2xl">1</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Assess School Readiness
              </h3>
              <p className="text-slate-600">
                Teachers and administrators complete a comprehensive assessment
                covering infrastructure, teacher readiness, school management,
                and learning requirements.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft">
                  <span className="text-primary text-2xl">2</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Collect Student Access Data
              </h3>
              <p className="text-slate-600">
                Students share information about their device access, internet
                availability, and technology use patterns through a mobile-friendly survey.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mb-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft">
                  <span className="text-primary text-2xl">3</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Get Personalized Recommendations
              </h3>
              <p className="text-slate-600">
                The system calculates compatibility scores for various EdTech tools
                and provides clear, actionable recommendations based on your school's reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-[10px] shadow-card p-6">
              <div className="mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                  <span className="text-primary text-xl">📊</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Transparent Compatibility Scoring
              </h3>
              <p className="text-slate-600">
                Rule-based scoring engine (not AI-based) ensures transparency
                so schools understand exactly why recommendations are made.
              </p>
            </div>
            <div className="bg-white rounded-[10px] shadow-card p-6">
              <div className="mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                  <span className="text-primary text-xl">👥</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Student Reality Data
              </h3>
              <p className="text-slate-600">
                Bridges the gap between what schools report and what students
                actually experience regarding technology access and usage.
              </p>
            </div>
            <div className="bg-white rounded-[10px] shadow-card p-6">
              <div className="mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                  <span className="text-primary text-xl">🗺️</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">
                Implementation Roadmaps
              </h3>
              <p className="text-slate-600">
                AI-generated 90-day plans help schools successfully adopt
                recommended technologies with proper preparation and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Flow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            See EduFit in Action
          </h2>
          <div className="space-y-12">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-6">One-Day MVP Demo Flow</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Experience the complete value proposition in minutes:
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
              <div className="space-y-4 text-right">
                <p className="text-primary font-bold">1</p>
                <p className="text-primary font-bold">2</p>
                <p className="text-primary font-bold">3</p>
                <p className="text-primary font-bold">4</p>
                <p className="text-primary font-bold">5</p>
                <p className="text-primary font-bold">6</p>
                <p className="text-primary font-bold">7</p>
              </div>
              <div className="space-y-4">
                <p className="font-medium text-slate-900 mb-1">Teacher creates school profile</p>
                <p className="font-medium text-slate-900 mb-1">School completes readiness assessment</p>
                <p className="font-medium text-slate-900 mb-1">Students access mobile survey</p>
                <p className="font-medium text-slate-900 mb-1">Students complete access survey</p>
                <p className="font-medium text-slate-900 mb-1">View compatibility scores & recommendations</p>
                <p className="font-medium text-slate-900 mb-1">See AI-generated implementation roadmap</p>
                <p className="font-medium text-slate-900">Platform ready for real-world use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to make better EdTech decisions?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Start by assessing your school's readiness and collecting student
            access data to get personalized, actionable recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/assessment"
              className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-slate-50 shadow-card text-lg font-medium transition-colors"
            >
              Begin School Assessment
            </a>
            <a
              href="/student"
              className="px-6 py-3 bg-white/10 border border-white text-white rounded-lg hover:bg-white/20 text-lg font-medium transition-colors"
            >
              Take Student Survey
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}