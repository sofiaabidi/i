import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "ASL Learner",
    avatar: "👩",
    rating: 5,
    text: "SignSpeak has transformed how I learn sign language. The real-time feedback is incredibly helpful and keeps me motivated every day.",
    highlight: "Real-time feedback"
  },
  {
    id: 2,
    name: "James Chen",
    role: "Deaf Educator",
    avatar: "👨",
    rating: 5,
    text: "As a deaf educator, I'm impressed by the accuracy and cultural respect shown in this platform. It's a game-changer for accessibility.",
    highlight: "Culturally respectful"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Healthcare Worker",
    avatar: "👩‍⚕️",
    rating: 5,
    text: "I use SignSpeak to communicate better with my deaf patients. The translation feature has improved my patient care significantly.",
    highlight: "Professional use"
  },
  {
    id: 4,
    name: "Alex Thompson",
    role: "Parent",
    avatar: "👨‍👧",
    rating: 5,
    text: "My daughter is deaf, and SignSpeak helped our whole family learn to communicate with her. We're closer than ever now.",
    highlight: "Family friendly"
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "College Student",
    avatar: "👩‍🎓",
    rating: 5,
    text: "The practice mode with instant corrections helped me ace my ASL course. Best learning tool I've used!",
    highlight: "Great for students"
  },
  {
    id: 6,
    name: "David Kim",
    role: "Interpreter",
    avatar: "👨‍💼",
    rating: 5,
    text: "Even as a professional interpreter, I use SignSpeak to stay sharp and practice new signs. The accuracy is outstanding.",
    highlight: "Professional grade"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Testimonials
          </Badge>
          <h2 className="text-gray-900 mb-4">
            Loved by Learners Worldwide
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their communication skills with SignSpeak.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="p-6 hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-100" />
              
              <div className="space-y-4">
                {/* Avatar and Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Highlight Badge */}
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {testimonial.highlight}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-teal-600 mb-2">1M+</div>
            <div className="text-gray-600">Signs Translated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-orange-600 mb-2">4.9/5</div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
