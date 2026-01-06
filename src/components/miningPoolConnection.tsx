/* eslint-disable simple-import-sort/imports */
import { useState } from 'react';

import { ChartBarIcon, CpuChipIcon, CurrencyDollarIcon, GlobeAltIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Fade, Slide } from 'react-awesome-reveal';

import cubesAnim from '../assets/cool2.gif';

const EnergyClientMatching = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Energy profile state
  const [energyProfile, setEnergyProfile] = useState({
    powerCapacity: 150,
    averageUptime: 18,
    localElectricityCost: 0.08,
    efficiency: 92,
    energyType: 'solar',
    location: '',
    surplusCapacity: 0,
  });

  // Client matching state
  const [clientForm, setClientForm] = useState({
    name: '',
    organization: '',
    country: '',
    energyNeeds: '',
    email: '',
    contact: '',
    budget: '',
    timeline: '',
    isEnergyBuyer: false,
    wantsLongTermContract: false,
  });

  // Calculate energy surplus and market value
  const calculateEnergySurplus = () => {
    const { powerCapacity, averageUptime, efficiency, localElectricityCost } = energyProfile;

    // Daily energy production (kWh)
    const dailyEnergy = (powerCapacity * averageUptime * efficiency) / 100;

    // Annual energy production (kWh)
    const annualEnergy = dailyEnergy * 365;

    // Estimated surplus (assuming 30% surplus capacity)
    const surplusEnergy = annualEnergy * 0.3;

    // Market value of surplus energy
    const marketValue = surplusEnergy * localElectricityCost * 1.2; // 20% premium for clean energy

    // Potential clients that could benefit
    const potentialClients = Math.floor(surplusEnergy / 1000); // 1 client per 1000 kWh

    return {
      dailyEnergy: dailyEnergy.toFixed(1),
      annualEnergy: annualEnergy.toFixed(0),
      surplusEnergy: surplusEnergy.toFixed(0),
      marketValue: marketValue.toFixed(0),
      potentialClients: potentialClients,
    };
  };

  const handleEnergyProfileChange = (field: string, value: string | number) => {
    setEnergyProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleClientFormChange = (field: string, value: string | boolean) => {
    setClientForm(prev => ({ ...prev, [field]: value }));
  };

  const handleClientSubmission = () => {
    // Generate client request ID
    const requestId = `CLIENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log('Client request submitted:', { ...clientForm, requestId });
    // Here you would typically send the data to your backend
  };

  const tabs = [
    { id: 'profile', label: 'Energy Profile', icon: CpuChipIcon },
    { id: 'surplus', label: 'Surplus Analysis', icon: ChartBarIcon },
    { id: 'clients', label: 'Find Clients', icon: GlobeAltIcon },
    { id: 'marketplace', label: 'Energy Marketplace', icon: CurrencyDollarIcon },
    { id: 'contracts', label: 'Contracts', icon: KeyIcon },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-600/10 to-emerald-600/10 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
          <CpuChipIcon className="h-6 w-6 text-green-400" />
          Energy Production Profile
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">⚙️ Power Capacity (kW)</label>
              <input
                type="number"
                value={energyProfile.powerCapacity}
                onChange={e => handleEnergyProfileChange('powerCapacity', Number(e.target.value))}
                className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="150"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">🕓 Average Uptime (hours/day)</label>
              <input
                type="number"
                value={energyProfile.averageUptime}
                onChange={e => handleEnergyProfileChange('averageUptime', Number(e.target.value))}
                className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="18"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                💰 Local Electricity Cost (USD/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={energyProfile.localElectricityCost}
                onChange={e => handleEnergyProfileChange('localElectricityCost', Number(e.target.value))}
                className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="0.08"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">🔋 Efficiency (%)</label>
              <input
                type="number"
                value={energyProfile.efficiency}
                onChange={e => handleEnergyProfileChange('efficiency', Number(e.target.value))}
                className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="92"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">⚡ Energy Type</label>
              <select
                value={energyProfile.energyType}
                onChange={e => handleEnergyProfileChange('energyType', e.target.value)}
                className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white focus:border-green-500 focus:outline-none"
              >
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydroelectric</option>
                <option value="geothermal">Geothermal</option>
                <option value="biomass">Biomass</option>
                <option value="nuclear">Nuclear</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">📍 Location</label>
              <input
                type="text"
                value={energyProfile.location}
                onChange={e => handleEnergyProfileChange('location', e.target.value)}
                className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Energy Surplus Estimation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
            <span className="text-gray-300">Estimated Surplus Capacity:</span>
            <code className="font-mono text-blue-400">30% of total production</code>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
            <span className="text-gray-300">Market Premium:</span>
            <code className="font-mono text-blue-400">+20% for clean energy</code>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-600/20 p-3">
          <p className="text-sm text-yellow-300">
            💡 Your surplus energy can be sold to clients looking for clean, reliable power sources instead of being
            wasted.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSurplusTab = () => {
    const surplusData = calculateEnergySurplus();

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-600/10 to-emerald-600/10 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Energy Surplus Analysis</h3>
          <p className="mb-4 text-gray-300">
            Analyze your energy production capacity and identify surplus energy that can be monetized instead of wasted.
          </p>
          <p className="text-sm italic text-green-400">"Turn waste into wealth."</p>
        </div>

        {/* Surplus Analysis Results */}
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Your Energy Surplus Profile</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Production Metrics */}
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <p className="mb-1 text-sm text-gray-400">Daily Energy Production</p>
                <p className="text-xl font-bold text-purple-400">{surplusData.dailyEnergy} kWh/day</p>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <p className="mb-1 text-sm text-gray-400">Annual Energy Production</p>
                <p className="text-xl font-bold text-purple-400">{surplusData.annualEnergy} kWh/year</p>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <p className="mb-1 text-sm text-gray-400">Estimated Surplus Energy</p>
                <p className="text-xl font-bold text-green-400">{surplusData.surplusEnergy} kWh/year</p>
              </div>
            </div>

            {/* Market Value */}
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <p className="mb-1 text-sm text-gray-400">Market Value of Surplus</p>
                <p className="text-xl font-bold text-green-400">${surplusData.marketValue} USD/year</p>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <p className="mb-1 text-sm text-gray-400">Potential Clients</p>
                <p className="text-xl font-bold text-blue-400">{surplusData.potentialClients} clients</p>
              </div>

              <div className="rounded-lg bg-slate-800/50 p-4">
                <p className="mb-1 text-sm text-gray-400">Energy Type</p>
                <p className="text-xl font-bold capitalize text-yellow-400">{energyProfile.energyType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Matching Opportunities */}
        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">Client Matching Opportunities</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-slate-800/50 p-4 text-center">
              <h4 className="mb-2 font-semibold text-white">Data Centers</h4>
              <p className="text-sm text-gray-300">High-demand, 24/7 operations</p>
              <p className="mt-2 text-lg font-bold text-blue-400">$0.12/kWh</p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-4 text-center">
              <h4 className="mb-2 font-semibold text-white">Manufacturing</h4>
              <p className="text-sm text-gray-300">Industrial energy consumers</p>
              <p className="mt-2 text-lg font-bold text-green-400">$0.10/kWh</p>
            </div>

            <div className="rounded-lg bg-slate-800/50 p-4 text-center">
              <h4 className="mb-2 font-semibold text-white">EV Charging</h4>
              <p className="text-sm text-gray-300">Growing clean energy demand</p>
              <p className="mt-2 text-lg font-bold text-purple-400">$0.15/kWh</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-600/20 p-3">
            <p className="text-sm text-yellow-300">
              💡 Your surplus energy can be sold at premium rates to clients who value clean, reliable power sources.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderClientsTab = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Find Energy Clients</h3>
        <p className="mb-4 text-gray-300">
          Connect with clients looking for clean energy sources. Many organizations are seeking reliable energy
          suppliers to reduce costs and meet sustainability goals.
        </p>
      </div>

      {/* Client Registration Form */}
      <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Client Registration</h3>
        <p className="mb-4 text-gray-300">Register as an energy buyer looking for clean, reliable power sources.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Name / Organization</label>
            <input
              type="text"
              value={clientForm.name}
              onChange={e => handleClientFormChange('name', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              placeholder="Your name or organization"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Country / Region</label>
            <input
              type="text"
              value={clientForm.country}
              onChange={e => handleClientFormChange('country', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              placeholder="Your country or region"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Energy Needs (kWh/month)</label>
            <input
              type="number"
              value={clientForm.energyNeeds}
              onChange={e => handleClientFormChange('energyNeeds', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              placeholder="Your monthly energy needs"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Contact Email</label>
            <input
              type="email"
              value={clientForm.email}
              onChange={e => handleClientFormChange('email', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Budget (USD/month)</label>
            <input
              type="number"
              value={clientForm.budget}
              onChange={e => handleClientFormChange('budget', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              placeholder="Your monthly budget"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Timeline</label>
            <select
              value={clientForm.timeline}
              onChange={e => handleClientFormChange('timeline', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select timeline</option>
              <option value="immediate">Immediate (within 1 month)</option>
              <option value="short">Short term (1-3 months)</option>
              <option value="medium">Medium term (3-6 months)</option>
              <option value="long">Long term (6+ months)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-300">Telegram / WhatsApp (optional)</label>
            <input
              type="text"
              value={clientForm.contact}
              onChange={e => handleClientFormChange('contact', e.target.value)}
              className="w-full rounded-lg bg-slate-800/50 px-3 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              placeholder="@username or +1234567890"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={clientForm.isEnergyBuyer}
              onChange={e => handleClientFormChange('isEnergyBuyer', e.target.checked)}
              className="rounded border-gray-600 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-300">I am actively looking to purchase clean energy.</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={clientForm.wantsLongTermContract}
              onChange={e => handleClientFormChange('wantsLongTermContract', e.target.checked)}
              className="rounded border-gray-600 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-300">I am interested in long-term energy contracts.</span>
          </label>
        </div>

        <button
          onClick={handleClientSubmission}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-emerald-700 hover:to-teal-700"
        >
          Register as Energy Buyer
        </button>

        <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-600/20 p-3">
          <p className="text-sm text-blue-300">Registered clients gain access to:</p>
          <ul className="mt-2 text-sm text-blue-300">
            <li>• Direct connection with energy producers</li>
            <li>• Competitive pricing for clean energy</li>
            <li>• Customized energy solutions</li>
            <li>• Sustainability reporting and tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderMarketplaceTab = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Energy Marketplace</h3>
        <p className="mb-4 text-gray-300">
          Browse available energy sources and connect with producers. Find the best deals on clean energy for your
          needs.
        </p>
      </div>

      {/* Available Energy Sources */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-600/10 to-emerald-600/10 p-6">
          <h4 className="mb-2 text-lg font-bold text-white">Solar Energy</h4>
          <p className="mb-3 text-sm text-gray-300">Clean solar power from rooftop installations</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price:</span>
              <span className="text-green-400">$0.08/kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Capacity:</span>
              <span className="text-green-400">150 kW</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Location:</span>
              <span className="text-green-400">California, USA</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Contact Producer
          </button>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
          <h4 className="mb-2 text-lg font-bold text-white">Wind Energy</h4>
          <p className="mb-3 text-sm text-gray-300">Reliable wind power from coastal farms</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price:</span>
              <span className="text-blue-400">$0.06/kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Capacity:</span>
              <span className="text-blue-400">500 kW</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Location:</span>
              <span className="text-blue-400">Texas, USA</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Contact Producer
          </button>
        </div>

        <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 p-6">
          <h4 className="mb-2 text-lg font-bold text-white">Hydroelectric</h4>
          <p className="mb-3 text-sm text-gray-300">Stable hydro power from small dams</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price:</span>
              <span className="text-yellow-400">$0.05/kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Capacity:</span>
              <span className="text-yellow-400">200 kW</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Location:</span>
              <span className="text-yellow-400">Oregon, USA</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700">
            Contact Producer
          </button>
        </div>
      </div>

      {/* Market Statistics */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Market Statistics</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-800/50 p-4 text-center">
            <p className="mb-1 text-sm text-gray-400">Active Producers</p>
            <p className="text-xl font-bold text-indigo-400">127</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4 text-center">
            <p className="mb-1 text-sm text-gray-400">Registered Buyers</p>
            <p className="text-xl font-bold text-indigo-400">89</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4 text-center">
            <p className="mb-1 text-sm text-gray-400">Total Capacity</p>
            <p className="text-xl font-bold text-indigo-400">2.3 MW</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4 text-center">
            <p className="mb-1 text-sm text-gray-400">Avg. Price</p>
            <p className="text-xl font-bold text-indigo-400">$0.07/kWh</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContractsTab = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-600/10 to-red-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Energy Contracts</h3>
        <p className="mb-4 text-gray-300">
          Manage your energy supply contracts and agreements. Track performance and optimize your energy procurement.
        </p>
      </div>

      {/* Contract Types */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-600/10 to-emerald-600/10 p-6">
          <h4 className="mb-3 text-lg font-bold text-white">Power Purchase Agreement (PPA)</h4>
          <p className="mb-4 text-sm text-gray-300">
            Long-term contracts for renewable energy supply with fixed pricing and guaranteed delivery.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration:</span>
              <span className="text-green-400">10-20 years</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Stability:</span>
              <span className="text-green-400">Fixed rates</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Risk Level:</span>
              <span className="text-green-400">Low</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Learn More
          </button>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
          <h4 className="mb-3 text-lg font-bold text-white">Virtual Power Purchase Agreement (VPPA)</h4>
          <p className="mb-4 text-sm text-gray-300">
            Financial contracts that provide renewable energy credits and price hedging without physical delivery.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration:</span>
              <span className="text-blue-400">5-15 years</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Stability:</span>
              <span className="text-blue-400">Hedged pricing</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Risk Level:</span>
              <span className="text-blue-400">Medium</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Learn More
          </button>
        </div>
      </div>

      {/* Contract Management */}
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">Contract Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4">
            <div>
              <h4 className="font-semibold text-white">Solar Farm Contract #SF-2024-001</h4>
              <p className="text-sm text-gray-300">150 kW solar installation - California</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Status: Active</p>
              <p className="text-sm text-green-400">$0.08/kWh</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4">
            <div>
              <h4 className="font-semibold text-white">Wind Energy VPPA #WE-2024-002</h4>
              <p className="text-sm text-gray-300">500 kW wind farm - Texas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Status: Pending</p>
              <p className="text-sm text-blue-400">$0.06/kWh</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-600/20 p-3">
          <p className="text-sm text-yellow-300">
            💡 All contracts include performance guarantees, maintenance coverage, and sustainability reporting.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br">
      <div className="mx-auto px-4 py-8 sm:max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <Slide triggerOnce direction="up">
            <h1 className="mb-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
              Caos Energy Network
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-300">
              Connect energy producers with buyers. Turn surplus energy into revenue instead of waste.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-400">
              Find clients for your excess energy. Discover clean energy sources for your needs.
            </p>
          </Slide>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Animation */}
          <div className="lg:col-span-1">
            <Fade triggerOnce>
              <div className="sticky top-8">
                <div className="flex items-center justify-center text-center">
                  <img
                    className="bottom-0 left-0 right-0 top-0 mx-auto rounded-2xl opacity-30 shadow-2xl"
                    src={cubesAnim}
                    alt="Caos energy network animation"
                  />
                </div>

                <div className="mt-8 rounded-xl border border-green-500/20 bg-gradient-to-r from-green-600/10 to-blue-600/10 p-6">
                  <p className="text-sm leading-relaxed text-gray-300">
                    The Caos Energy Network connects energy producers with buyers looking for clean, reliable power.
                    Transform your surplus energy into revenue and help organizations meet their sustainability goals.
                  </p>
                  <p className="mt-4 font-medium italic text-green-400">
                    From waste to wealth. Connect energy with purpose.
                  </p>
                </div>
              </div>
            </Fade>
          </div>

          {/* Right Column - Content Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                          : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <Fade triggerOnce>
              <div className="min-h-[600px]">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'surplus' && renderSurplusTab()}
                {activeTab === 'clients' && renderClientsTab()}
                {activeTab === 'marketplace' && renderMarketplaceTab()}
                {activeTab === 'contracts' && renderContractsTab()}
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyClientMatching;
