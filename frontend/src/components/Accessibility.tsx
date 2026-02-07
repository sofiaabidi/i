import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Globe, Ear, Volume2, Heart, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multiple Sign Languages",
    description: "Full support for ASL (American Sign Language) and ISL (Indian Sign Language) with more coming soon.",
    color: "blue"
  },
  {
    icon: Ear,
    title: "Built for Deaf Community",
    description: "Designed with input from deaf and hard-of-hearing users to ensure authentic and respectful representation.",
    color: "teal"
  },
  {
    icon: Volume2,
    title: "Voice & Text Output",
    description: "Dual output formats ensure communication is accessible to everyone, regardless of hearing ability.",
    color: "purple"
  },
  {
    icon: Heart,
    title: "Free Practice Mode",
    description: "Core learning and practice features are completely free. No credit card required to start learning.",
    color: "pink"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with a global community of learners and native signers for cultural exchange and practice.",
    color: "orange"
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    description: "Optimized for all devices and internet speeds to ensure smooth learning experience anywhere.",
    color: "green"
  }
];

const colorClasses = {
  blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  teal: "bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
  purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
  pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
  orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
  green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
};

export function Accessibility() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100">
            Accessibility & Inclusion
          </Badge>
          <h2 className="text-gray-900 mb-4">
            Built for Everyone, By Everyone
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We believe communication is a fundamental human right. Our platform is designed to be accessible, 
            inclusive, and respectful of deaf culture and sign language communities worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Commitment Statement */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 text-white border-0">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-white">Our Commitment to Accessibility</h3>
            <p className="text-blue-100 text-lg">
              SignSpeak is committed to WCAG 2.1 AA standards and works closely with the deaf and hard-of-hearing 
              community to ensure our platform serves everyone with dignity and respect. We continuously improve 
              based on feedback from real users.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Badge className="bg-white/20 text-white border-white/30">WCAG 2.1 AA</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Screen Reader Compatible</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Keyboard Navigation</Badge>
              <Badge className="bg-white/20 text-white border-white/30">High Contrast Mode</Badge>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
