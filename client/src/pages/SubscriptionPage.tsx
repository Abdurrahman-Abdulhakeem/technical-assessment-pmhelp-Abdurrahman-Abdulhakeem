import React from 'react';
import { motion } from 'framer-motion';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency } from '@/utils/cn';
import {
  Crown,
  Check,
  Star,
  Calendar,
  FileText,
  Headphones,
  Users,
  Zap,
  Shield
} from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { subscriptions, currentSubscription, isLoading, upgradeSubscription } = useSubscriptions();

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('appointments')) return <Calendar className="w-4 h-4" />;
    if (feature.includes('support')) return <Headphones className="w-4 h-4" />;
    if (feature.includes('analytics')) return <FileText className="w-4 h-4" />;
    if (feature.includes('priority')) return <Star className="w-4 h-4" />;
    if (feature.includes('family')) return <Users className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'from-slate-500 to-slate-600';
      case 'basic': return 'from-blue-500 to-blue-600';
      case 'premium': return 'from-purple-500 to-pink-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'free': return 'default';
      case 'basic': return 'info';
      case 'premium': return 'success';
      default: return 'default';
    }
  };

  const handleUpgrade = (subscriptionId: string) => {
    upgradeSubscription.mutate(subscriptionId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
        </div>
        <Loading size="lg" text="Loading subscription plans..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your healthcare needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Current Plan Display */}
        {currentSubscription && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <p className="text-sm text-slate-600">Current Plan</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getTierBadgeVariant(currentSubscription.subscription?.tier)}>
                    {currentSubscription.subscription?.name}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    • {currentSubscription.appointmentsUsed} / {currentSubscription.subscription?.appointmentLimit === -1 ? '∞' : currentSubscription.subscription?.appointmentLimit} used
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptions?.map((subscription, index) => {
          const isCurrentPlan = currentSubscription?.subscriptionId === subscription._id;
          const isPremium = subscription.tier === 'premium';
          
          return (
            <motion.div
              key={subscription._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              {isPremium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="success" className="shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`h-full relative overflow-hidden ${isPremium ? 'ring-2 ring-purple-500 shadow-2xl' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${getTierColor(subscription.tier)}`} />

                <CardContent className="p-8 relative">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${getTierColor(subscription.tier)} flex items-center justify-center`}>
                      {subscription.tier === 'free' && <Zap className="w-8 h-8 text-white" />}
                      {subscription.tier === 'basic' && <Star className="w-8 h-8 text-white" />}
                      {subscription.tier === 'premium' && <Crown className="w-8 h-8 text-white" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {subscription.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-slate-900">
                        {formatCurrency(subscription.price)}
                      </span>
                      {subscription.price > 0 && (
                        <span className="text-slate-500 text-lg">/month</span>
                      )}
                    </div>
                    
                    <p className="text-slate-600">{subscription.description}</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {subscription.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                    
                    {/* Appointment Limit */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <Calendar className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-slate-600">
                        {subscription.appointmentLimit === -1 
                          ? 'Unlimited appointments' 
                          : `${subscription.appointmentLimit} appointments per month`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="space-y-3">
                    {isCurrentPlan ? (
                      <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={isPremium ? 'primary' : 'outline'}
                        size="lg"
                        fullWidth
                        loading={upgradeSubscription.isPending}
                        onClick={() => handleUpgrade(subscription._id)}
                        className={isPremium ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}
                      >
                        {subscription.price === 0 ? 'Downgrade to Free' : 'Upgrade Plan'}
                      </Button>
                    )}
                    
                    {subscription.price > 0 && (
                      <p className="text-xs text-center text-slate-500">
                        Cancel anytime. No hidden fees.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-sm text-slate-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">What happens to unused appointments?</h4>
                <p className="text-sm text-slate-600">
                  Unused appointments don't roll over to the next month, but you can always upgrade for more.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Is my data secure?</h4>
                <p className="text-sm text-slate-600">
                  Absolutely. We use enterprise-grade encryption and comply with all healthcare data regulations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Do I get refunds?</h4>
                <p className="text-sm text-slate-600">
                  We offer a 30-day money-back guarantee for all paid plans. No questions asked.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export { SubscriptionPage };
