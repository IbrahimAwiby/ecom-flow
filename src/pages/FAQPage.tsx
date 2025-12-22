// src/pages/FAQPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Clock,
  Shield,
  Truck,
  CreditCard,
  RefreshCw,
  Package,
  Globe,
  Smartphone,
  User,
  Lock,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    id: "general",
    name: "General",
    icon: <HelpCircle className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "shipping",
    name: "Shipping & Delivery",
    icon: <Truck className="h-5 w-5" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "orders",
    name: "Orders & Returns",
    icon: <Package className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "payment",
    name: "Payment",
    icon: <CreditCard className="h-5 w-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "account",
    name: "Account",
    icon: <User className="h-5 w-5" />,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "security",
    name: "Security & Privacy",
    icon: <Shield className="h-5 w-5" />,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const faqData = {
  general: [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items in their original condition with tags attached. Some items like electronics have a 14-day return window. Digital products and personalized items are non-returnable.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can contact us via email at support@example.com, through our live chat (available 24/7), or call us at 1-800-123-4567. Our average response time is under 2 hours during business hours.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination. You can view shipping rates at checkout before placing your order.",
    },
    {
      question: "What are your business hours?",
      answer:
        "Our customer support team is available Monday to Friday, 9 AM to 6 PM EST. Our online store is open 24/7 for shopping, and orders can be placed at any time.",
    },
  ],
  shipping: [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day. International shipping typically takes 7-14 business days.",
    },
    {
      question: "How much does shipping cost?",
      answer:
        "We offer free standard shipping on orders over $50. Standard shipping is $5.99 for orders under $50. Express shipping is $12.99, and overnight shipping is $24.99.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! Once your order ships, you'll receive a tracking number via email. You can track your order directly from our website or using the carrier's tracking system.",
    },
    {
      question: "Do you offer same-day delivery?",
      answer:
        "Same-day delivery is available in select metropolitan areas for orders placed before 12 PM local time. This service costs $19.99 and requires a minimum order of $25.",
    },
  ],
  orders: [
    {
      question: "How do I cancel or modify my order?",
      answer:
        "You can cancel or modify your order within 1 hour of placing it through your account dashboard. After that, please contact customer support immediately. Once the order ships, changes cannot be made.",
    },
    {
      question: "What if I receive a damaged item?",
      answer:
        "If you receive a damaged item, please contact us within 48 hours of delivery with photos of the damage. We'll send a replacement immediately or issue a full refund if preferred.",
    },
    {
      question: "How do returns work?",
      answer:
        "Initiate a return from your account dashboard, print the prepaid return label, and drop off the package. Once we receive and inspect the item, your refund will be processed within 5-7 business days.",
    },
    {
      question: "Can I exchange an item?",
      answer:
        "Yes! You can request an exchange for a different size or color. If the exchange item costs more, you'll pay the difference. If it costs less, we'll refund the difference.",
    },
  ],
  payment: [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. We also support cryptocurrency payments through BitPay.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Absolutely! We use 256-bit SSL encryption and are PCI-DSS compliant. We never store your full payment details on our servers. All transactions are processed through secure payment gateways.",
    },
    {
      question: "Do you offer installment payments?",
      answer:
        "Yes! We partner with Affirm, Klarna, and Afterpay to offer installment payments. You can split your purchase into 4 interest-free payments or choose longer terms with interest.",
    },
    {
      question: "Will I be charged sales tax?",
      answer:
        "Sales tax is calculated based on your shipping address and local tax laws. You'll see the exact tax amount during checkout before completing your purchase.",
    },
  ],
  account: [
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. The link expires in 1 hour for security. You can also change your password from your account settings.",
    },
    {
      question: "Can I have multiple shipping addresses?",
      answer:
        "Yes! You can save multiple addresses in your account. Set a default address for faster checkout, and choose any saved address when placing new orders.",
    },
    {
      question: "How do I update my account information?",
      answer:
        "Log into your account, go to 'Account Settings', and update your personal information, email, password, and notification preferences. Changes are saved immediately.",
    },
    {
      question: "Why was my account suspended?",
      answer:
        "Accounts may be suspended for security reasons, suspicious activity, or violation of terms. Contact customer support to resolve any account issues.",
    },
  ],
  security: [
    {
      question: "How do you protect my personal data?",
      answer:
        "We use industry-standard encryption, secure servers, and regular security audits. We never sell your data to third parties. Read our full privacy policy for more details.",
    },
    {
      question: "Are my login credentials secure?",
      answer:
        "Yes! Passwords are hashed using bcrypt, and we offer two-factor authentication for added security. We monitor for suspicious login attempts and will notify you of any unusual activity.",
    },
    {
      question: "How do I enable two-factor authentication?",
      answer:
        "Go to Account Settings > Security > Two-Factor Authentication. You can enable it via SMS, authenticator app, or email. We highly recommend this for account security.",
    },
    {
      question: "What should I do if I suspect fraud?",
      answer:
        "Immediately contact our security team at security@example.com and change your password. We'll investigate and take appropriate action to secure your account.",
    },
  ],
};

const popularQuestions = [
  "How do I track my order?",
  "What is your return policy?",
  "How long does shipping take?",
  "Do you ship internationally?",
  "How can I contact support?",
  "What payment methods do you accept?",
  "How do I reset my password?",
  "Is my payment information secure?",
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFaqs = faqData[activeCategory as keyof typeof faqData].filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (index: string) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <HelpCircle className="relative h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                  Help Center
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Find answers to common questions and get support
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                ×
              </Button>
            )}
          </div>

          {/* Popular Questions */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {popularQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setSearchQuery(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription>Browse by topic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      activeCategory === category.id ? "secondary" : "ghost"
                    }
                    className="w-full justify-start gap-3 h-auto py-3 px-4"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <div className={category.color}>{category.icon}</div>
                    </div>
                    <div className="flex-1 text-left">{category.name}</div>
                    {activeCategory === category.id && (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Help Card */}
            <Card className="mt-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Still need help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is here for you
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link to="/contact">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <a href="tel:+18001234567">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us Now
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {faqCategories.find((c) => c.id === activeCategory)?.name}
                    </CardTitle>
                    <CardDescription>
                      {filteredFaqs.length} questions available
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    <Clock className="mr-1 h-3 w-3" />
                    Updated today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {searchQuery && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      Showing results for:{" "}
                      <span className="font-semibold">"{searchQuery}"</span>
                    </p>
                  </div>
                )}

                <Accordion type="multiple" className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border rounded-lg px-4 data-[state=open]:border-primary data-[state=open]:bg-primary/5"
                      >
                        <AccordionTrigger className="py-4 hover:no-underline">
                          <div className="flex items-start gap-3 text-left">
                            <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="font-medium text-base">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="pl-8 pr-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-muted-foreground">
                                Was this helpful?{" "}
                                <Button
                                  variant="link"
                                  className="h-auto p-0 text-xs"
                                >
                                  Yes
                                </Button>{" "}
                                •{" "}
                                <Button
                                  variant="link"
                                  className="h-auto p-0 text-xs"
                                >
                                  No
                                </Button>
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No results found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        We couldn't find any FAQs matching "{searchQuery}"
                      </p>
                      <Button onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    </div>
                  )}
                </Accordion>
              </CardContent>
            </Card>

            {/* Additional Help Section */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monday - Friday
                      </span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 4:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground">
                      Live chat available 24/7 • Email response within 2 hours
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-muted/50 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/track-order">
                        <Truck className="mr-2 h-4 w-4" />
                        Track Your Order
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/returns">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Start a Return
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/shipping">
                        <Package className="mr-2 h-4 w-4" />
                        Shipping Info
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/contact">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Us
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact CTA */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is ready to help you
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button asChild>
                    <Link to="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Support
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+18001234567">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import missing icons
import { ChevronRight, Phone } from "lucide-react";
