"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function PricingView() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Basic",
      price: isAnnual ? 190 : 19,
      description: "Perfect for getting started",
      features: [
        "3 Mock Interviews per month",
        "Basic Resume Builder",
        "AI Cover Letter Generation",
        "Email Support",
        "Basic Interview Analytics"
      ],
      buttonText: "Get Started",
      featured: false
    },
    {
      name: "Pro",
      price: isAnnual ? 490 : 49,
      description: "For serious career seekers",
      features: [
        "Unlimited Mock Interviews",
        "Advanced Resume Builder",
        "Priority AI Cover Letter Generation",
        "24/7 Priority Support",
        "Advanced Interview Analytics",
        "Custom Interview Scenarios",
        "Career Path Planning"
      ],
      buttonText: "Start Free Trial",
      featured: true
    }
  ]

  return (
    <div className="container max-w-6xl px-4 py-16 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose the Perfect Plan for Your Career Growth
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Whether you're just starting or advancing your career, we have the right tools for you
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={cn("text-sm", !isAnnual && "text-primary font-medium")}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <span className={cn("text-sm", isAnnual && "text-primary font-medium")}>
            Annually
            <Badge variant="secondary" className="ml-2">Save 20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={cn(
              "relative p-8 border-2 transition-all duration-200 hover:border-primary",
              plan.featured && "border-primary shadow-lg shadow-primary/20"
            )}
          >
            {plan.featured && (
              <Badge 
                className="absolute -top-3 right-4"
                variant="default"
              >
                Most Popular
              </Badge>
            )}
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              {isAnnual && (
                <p className="text-sm text-muted-foreground mt-1">
                  Billed annually (${plan.price * 10}/year)
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className={cn(
                "w-full",
                plan.featured ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"
              )}
              size="lg"
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
} 