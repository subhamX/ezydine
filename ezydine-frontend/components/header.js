
import Head from 'next/head'
import { AnnotationIcon, GlobeAltIcon, ShieldCheckIcon, LightningBoltIcon, ScaleIcon, CogIcon, PaperAirplaneIcon} from '@heroicons/react/outline'

const features = [
  {
    name: 'Instant Information',
    description:
      'Immediately inform yourself about the dining hall capacities on the front page. No more having to visit three different pages.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Streamlined Interface',
    description:
      'Ezydine is fast, sleek, readable, and responsive. Don\'t waste time waiting for things to load or figuring out what\'s where. ',
    icon: PaperAirplaneIcon,
  },
  {
    name: 'Smart Predictions',
    description:
      'Using machine learning, Ezydine predicts dining hall capacities for future times based on previous data. This way, you can plan your meal schedule ahead of time',
    icon: CogIcon,
  },
  {
    name: 'Slow the Spread',
    description:
      'By using Ezydine to avoid crowds and ease the dining hall crunch, you can help slow down COVID-19 transmissions.',
    icon: ShieldCheckIcon,
  },
]


export default function Header() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Ezydine</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A streamlined dining experience.
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Ezydine brings the best of Columbia Dining into one website.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
