import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Plus, Send, TrendingUp, Wallet, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { demoWallet, demoTokenPrices, demoTransactionHistory, demoStakingPools } from '../data/demoData';

const WalletPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [prices, setPrices] = useState(demoTokenPrices);
  const [showBalance, setShowBalance] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Live price ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        ...prev,
        RIIDE: prev.RIIDE * (0.95 + Math.random() * 0.1), // ±5% variation
        ZEM3X: prev.ZEM3X * (0.95 + Math.random() * 0.1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateUSDValue = (token, amount) => {
    return (amount * (prices[token] || 0)).toFixed(2);
  };

  const totalUSDValue = Object.entries(demoWallet.balances).reduce((total, [token, amount]) => {
    return total + parseFloat(calculateUSDValue(token, amount));
  }, 0);

  return (
    <div className="wallet-page">
      <div className="container mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="demo-banner mb-6">
          <Badge variant="outline" className="demo-badge">
            DEMO MODE - Mock wallet with simulated data
          </Badge>
        </div>

        {/* Header */}
        <div className="wallet-header mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="heading-1">Your Wallet</h1>
              <p className="body-medium text-muted mt-2">
                Manage your crypto assets and earn rewards
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card className="portfolio-overview mb-8">
          <div className="card-header">
            <h2 className="heading-2">Portfolio Overview</h2>
            <div className="currency-selector">
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="currency-select"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          
          <div className="portfolio-value">
            <div className="total-value">
              <span className="value-label">Total Balance</span>
              <div className="value-amount">
                {showBalance ? (
                  <>
                    <span className="amount">${totalUSDValue.toLocaleString()}</span>
                    <span className="change positive">+$127.50 (2.4%)</span>
                  </>
                ) : (
                  <span className="amount-hidden">****</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Live Price Tickers */}
        <div className="price-tickers mb-8">
          <h3 className="heading-3 mb-4">Live Prices</h3>
          <div className="ticker-grid">
            <div className="ticker-card riide">
              <div className="ticker-header">
                <div className="token-info">
                  <span className="token-symbol">RIIDE</span>
                  <span className="token-name">RIIDE Token</span>
                </div>
                <TrendingUp className="w-4 h-4 text-riide-primary" />
              </div>
              <div className="ticker-price">
                <span className="price">${prices.RIIDE.toFixed(4)}</span>
                <span className="change positive">+2.1%</span>
              </div>
            </div>
            
            <div className="ticker-card zem3x">
              <div className="ticker-header">
                <div className="token-info">
                  <span className="token-symbol">ZEM3X</span>
                  <span className="token-name">Zero Emission 3X</span>
                </div>
                <TrendingUp className="w-4 h-4 text-riide-accent" />
              </div>
              <div className="ticker-price">
                <span className="price">${prices.ZEM3X.toFixed(4)}</span>
                <span className="change positive">+1.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Token Balances */}
        <div className="token-balances mb-8">
          <h3 className="heading-3 mb-4">Your Assets</h3>
          <div className="balances-grid">
            {Object.entries(demoWallet.balances).map(([token, amount]) => (
              <Card key={token} className="balance-card">
                <div className="balance-header">
                  <div className="token-icon">
                    {token === 'RIIDE' ? '🌱' : token === 'ZEM3X' ? '⚡' : 
                     token === 'BTC' ? '₿' : token === 'ETH' ? 'Ξ' : '💰'}
                  </div>
                  <div className="token-details">
                    <span className="token-name">{token}</span>
                    <span className="token-balance">
                      {showBalance ? amount.toLocaleString() : '****'}
                    </span>
                  </div>
                </div>
                {showBalance && (
                  <div className="balance-usd">
                    ${calculateUSDValue(token, amount)}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions mb-8">
          <h3 className="heading-3 mb-4">Quick Actions</h3>
          <div className="actions-grid">
            <Button 
              className="action-btn stake"
              onClick={() => window.location.href = '/dao/manage-tokens'}
            >
              <TrendingUp className="w-5 h-5" />
              <div className="action-content">
                <span className="action-title">Stake</span>
                <span className="action-desc">Earn up to 18.2% APR</span>
              </div>
            </Button>
            
            <Button 
              className="action-btn swap"
              onClick={() => setShowSwapModal(true)}
            >
              <ArrowUpDown className="w-5 h-5" />
              <div className="action-content">
                <span className="action-title">Swap</span>
                <span className="action-desc">Exchange tokens</span>
              </div>
            </Button>
            
            <Button className="action-btn transfer">
              <Send className="w-5 h-5" />
              <div className="action-content">
                <span className="action-title">Transfer</span>
                <span className="action-desc">Send to address</span>
              </div>
            </Button>
            
            <Button className="action-btn buy">
              <Plus className="w-5 h-5" />
              <div className="action-content">
                <span className="action-title">Buy</span>
                <span className="action-desc">Add funds</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Staking Pools */}
        <div className="staking-pools mb-8">
          <div className="section-header">
            <h3 className="heading-3">Staking Pools</h3>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/dao/manage-tokens'}
            >
              View All
            </Button>
          </div>
          
          <div className="pools-grid">
            {demoStakingPools.slice(0, 2).map(pool => (
              <Card key={pool.id} className="staking-card">
                <div className="pool-header">
                  <h4 className="pool-name">{pool.name}</h4>
                  <Badge className="apr-badge">{pool.apr}% APR</Badge>
                </div>
                
                <div className="pool-stats">
                  <div className="stat">
                    <span className="stat-label">Your Stake</span>
                    <span className="stat-value">{pool.userStaked.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Rewards</span>
                    <span className="stat-value text-riide-primary">
                      +{pool.rewards.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="pool-actions">
                  <Button size="sm" variant="outline">Stake More</Button>
                  <Button size="sm">Claim</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="recent-transactions">
          <div className="section-header">
            <h3 className="heading-3">Recent Activity</h3>
            <Button variant="ghost" onClick={() => window.location.href = '/history'}>
              View All
            </Button>
          </div>
          
          <Card className="transactions-card">
            <div className="transactions-list">
              {demoTransactionHistory.slice(0, 5).map(tx => (
                <div key={tx.id} className="transaction-item">
                  <div className="tx-icon">
                    {tx.type === 'ride_reward' ? '🚗' : 
                     tx.type === 'staking_reward' ? '💰' : 
                     tx.type === 'token_purchase' ? '🛒' : '👥'}
                  </div>
                  
                  <div className="tx-details">
                    <span className="tx-description">{tx.description}</span>
                    <span className="tx-date">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="tx-amount">
                    <span className={`amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.token}
                    </span>
                    <Badge className="status-badge">{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Swap Modal */}
        {showSwapModal && (
          <SwapModal 
            onClose={() => setShowSwapModal(false)}
            prices={prices}
          />
        )}
      </div>
    </div>
  );
};

// Swap Modal Component
const SwapModal = ({ onClose, prices }) => {
  const [fromToken, setFromToken] = useState('USDT');
  const [toToken, setToToken] = useState('RIIDE');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('');

  useEffect(() => {
    if (fromAmount && prices[toToken] && prices[fromToken]) {
      const converted = (parseFloat(fromAmount) * prices[fromToken]) / prices[toToken];
      setToAmount(converted.toFixed(2));
    }
  }, [fromAmount, fromToken, toToken, prices]);

  const handleSwap = () => {
    // Mock swap - just show success toast
    alert(`Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="swap-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Swap Tokens</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="swap-form">
          <div className="swap-section">
            <label>From</label>
            <div className="token-input">
              <select value={fromToken} onChange={e => setFromToken(e.target.value)}>
                <option value="USDT">USDT</option>
                <option value="ICP">ICP</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
              <input 
                type="number" 
                value={fromAmount}
                onChange={e => setFromAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="swap-arrow">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          
          <div className="swap-section">
            <label>To</label>
            <div className="token-input">
              <select value={toToken} onChange={e => setToToken(e.target.value)}>
                <option value="RIIDE">RIIDE</option>
                <option value="ZEM3X">ZEM3X</option>
              </select>
              <input 
                type="number" 
                value={toAmount}
                readOnly
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="swap-info">
            <div className="rate-info">
              1 {fromToken} = {prices[toToken] && prices[fromToken] ? 
                (prices[fromToken] / prices[toToken]).toFixed(4) : '0'} {toToken}
            </div>
          </div>
          
          <Button className="swap-button" onClick={handleSwap}>
            Confirm Swap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;