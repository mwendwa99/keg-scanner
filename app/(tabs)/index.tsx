import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Package, MapPin, TrendingUp, Clock } from 'lucide-react-native';

const StatCard = ({ icon, title, value, color }: any) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statIcon}>
      {icon}
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const RecentActivity = ({ icon, title, subtitle, time }: any) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: '#EBF8FF' }]}>
      {icon}
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, John!</Text>
          <Text style={styles.date}>Today, {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon={<Package size={24} color="#2563EB" />}
            title="Total Kegs"
            value="248"
            color="#2563EB"
          />
          <StatCard
            icon={<MapPin size={24} color="#10B981" />}
            title="Active Outlets"
            value="32"
            color="#10B981"
          />
          <StatCard
            icon={<TrendingUp size={24} color="#F59E0B" />}
            title="Delivered Today"
            value="18"
            color="#F59E0B"
          />
          <StatCard
            icon={<Clock size={24} color="#EF4444" />}
            title="Pending Pickup"
            value="7"
            color="#EF4444"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            <RecentActivity
              icon={<Package size={16} color="#2563EB" />}
              title="Kegs Assigned"
              subtitle="Delivered to Corner Store"
              time="2 hrs ago"
            />
            <RecentActivity
              icon={<Package size={16} color="#10B981" />}
              title="Kegs Collected"
              subtitle="Picked up from Downtown Bar"
              time="4 hrs ago"
            />
            <RecentActivity
              icon={<MapPin size={16} color="#F59E0B" />}
              title="New Outlet Added"
              subtitle="Sunset Restaurant"
              time="1 day ago"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Package size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Scan QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MapPin size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>View Routes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});