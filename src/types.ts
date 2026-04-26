export interface Service { title: string; description: string; icon: string }

export interface ClientConfig {
  name: string; tagline: string; description: string; phone: string
  email: string; address: string; primaryColor: string; accentColor: string
  industry: string; ctaText: string; services: Service[]
}
