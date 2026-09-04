// screens/CookDashboardScreen.tsx

import React, { useState } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import {
  Text,
  Card,
  Switch,
  IconButton,
  Avatar,
  Divider,
  Surface,
} from 'react-native-paper';

import Ionicons from '@expo/vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { logout } from '../store/slices/authSlice';


// ==================================================
// TYPES
// ==================================================

type TabType =
  | 'dashboard'
  | 'orders'
  | 'menu'
  | 'earnings'
  | 'profile';


// ==================================================
// MOCK DATA
// ==================================================

const MOCK_STATS = {
  todayEarnings: 2450,
  totalOrders: 24,
  pendingOrders: 3,
  completedOrders: 21,
  avgRating: 4.8,
  totalCustomers: 156,
  weeklyEarnings: 15600,
  monthlyEarnings: 58200,
};


const MOCK_RECENT_ORDERS = [
  {
    id: 'ORD001',
    customerName: 'Rahul Sharma',
    mealName: 'Dal Chawal',
    quantity: 2,
    totalPrice: 280,
    status: 'pending',
    time: '2 min ago',
  },
  {
    id: 'ORD002',
    customerName: 'Priya Patel',
    mealName: 'Veg Thali',
    quantity: 1,
    totalPrice: 150,
    status: 'preparing',
    time: '15 min ago',
  },
];


// ==================================================
// COMPONENT
// ==================================================

const CookDashboardScreen: React.FC = () => {

  const dispatch = useAppDispatch();

  const { colors } = useAppSelector(
    (state) => state.theme
  );

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CookDashboard'>>();

  const [activeTab, setActiveTab] =
    useState<TabType>('dashboard');

  const [isOnline, setIsOnline] =
    useState(true);

  // Responsive screen width
  const { width } = useWindowDimensions();


  // ==================================================
  // DASHBOARD
  // ==================================================

  const renderDashboard = () => (

    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.headerTextContainer}>

          <Text
            style={[
              styles.welcomeText,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Welcome back,
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={[
              styles.kitchenName,
              {
                color: colors.text,
              },
            ]}
          >
            Priya's Kitchen 🍳
          </Text>

        </View>

        <Avatar.Text
          size={48}
          label="P"
          style={{
            backgroundColor:
              colors.primary,
          }}
        />

      </View>


      {/* ONLINE / OFFLINE */}

      <Card
        style={[
          styles.toggleCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <View style={styles.toggleContent}>

          <View style={styles.toggleInfo}>

            <Ionicons
              name={
                isOnline
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={24}
              color={
                isOnline
                  ? '#4CAF50'
                  : colors.textSecondary
              }
            />

            <View style={styles.toggleText}>

              <Text
                style={[
                  styles.toggleTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isOnline
                  ? 'You are Online'
                  : 'You are Offline'}
              </Text>

              <Text
                style={[
                  styles.toggleSubtitle,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {isOnline
                  ? 'Accepting new orders'
                  : 'Not accepting orders'}
              </Text>

            </View>

          </View>

          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            color={colors.primary}
          />

        </View>

      </Card>


      {/* TODAY'S OVERVIEW */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Today's Overview
      </Text>


      <View style={styles.statsGrid}>

        {/* EARNINGS */}

        <Card
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View style={styles.statContent}>

            <Ionicons
              name="wallet"
              size={28}
              color={colors.primary}
            />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              ₹{MOCK_STATS.todayEarnings}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Earnings
            </Text>

          </View>

        </Card>


        {/* TOTAL ORDERS */}

        <Card
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View style={styles.statContent}>

            <Ionicons
              name="receipt"
              size={28}
              color="#4CAF50"
            />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {MOCK_STATS.totalOrders}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Total Orders
            </Text>

          </View>

        </Card>


        {/* PENDING */}

        <Card
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View style={styles.statContent}>

            <Ionicons
              name="time"
              size={28}
              color="#FF9800"
            />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {MOCK_STATS.pendingOrders}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Pending
            </Text>

          </View>

        </Card>


        {/* COMPLETED */}

        <Card
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View style={styles.statContent}>

            <Ionicons
              name="checkmark-circle"
              size={28}
              color="#2196F3"
            />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {MOCK_STATS.completedOrders}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Completed
            </Text>

          </View>

        </Card>


        {/* RATING */}

        <Card
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View style={styles.statContent}>

            <Ionicons
              name="star"
              size={28}
              color="#FFD700"
            />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {MOCK_STATS.avgRating}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Avg Rating
            </Text>

          </View>

        </Card>


        {/* CUSTOMERS */}

        <Card
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View style={styles.statContent}>

            <Ionicons
              name="people"
              size={28}
              color="#9C27B0"
            />

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {MOCK_STATS.totalCustomers}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Customers
            </Text>

          </View>

        </Card>

      </View>


      {/* RECENT ORDERS HEADER */}

      <View style={styles.sectionHeader}>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Recent Orders
        </Text>

        <TouchableOpacity
          onPress={() =>
            setActiveTab('orders')
          }
        >

          <Text
            style={[
              styles.seeAll,
              {
                color: colors.primary,
              },
            ]}
          >
            See All
          </Text>

        </TouchableOpacity>

      </View>


      {/* RECENT ORDERS */}

      {MOCK_RECENT_ORDERS.map(
        (order) => (

          <Card
            key={order.id}
            style={[
              styles.orderCard,
              {
                backgroundColor:
                  colors.surface,
              },
            ]}
          >

            <View style={styles.orderContent}>

              <View
                style={
                  styles.orderHeader
                }
              >

                <View
                  style={
                    styles.orderCustomer
                  }
                >

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.customerName,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {order.customerName}
                  </Text>

                  <Text
                    style={[
                      styles.orderId,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    #{order.id} • {order.time}
                  </Text>

                </View>


                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        order.status ===
                        'pending'
                          ? '#FF9800'
                          : '#2196F3',
                    },
                  ]}
                >

                  <Text
                    style={
                      styles.statusText
                    }
                  >
                    {order.status ===
                    'pending'
                      ? 'New'
                      : 'Preparing'}
                  </Text>

                </View>

              </View>


              <Divider
                style={
                  styles.orderDivider
                }
              />


              <View
                style={
                  styles.orderDetails
                }
              >

                <Text
                  numberOfLines={1}
                  style={[
                    styles.orderMeal,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {order.mealName} x
                  {order.quantity}
                </Text>

                <Text
                  style={[
                    styles.orderPrice,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ₹{order.totalPrice}
                </Text>

              </View>


              {order.status ===
                'pending' && (

                <View
                  style={
                    styles.orderActions
                  }
                >

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.rejectButton,
                    ]}
                  >
                    <Text
                      style={
                        styles.rejectText
                      }
                    >
                      Reject
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.acceptButton,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.acceptText
                      }
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>

                </View>

              )}

            </View>

          </Card>

        )
      )}


      <View
        style={styles.bottomPadding}
      />

    </ScrollView>
  );


  // ==================================================
  // ORDERS
  // ==================================================

  const renderOrders = () => (

    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

      <Text
        style={[
          styles.pageTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Orders
      </Text>


      {/* FILTERS */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={
          styles.filterContent
        }
      >

        {[
          'All',
          'Pending',
          'Accepted',
          'Preparing',
          'Ready',
          'Delivered',
        ].map((filter) => (

          <TouchableOpacity
            key={filter}
            style={styles.filterChip}
          >

            <Text
              style={[
                styles.filterText,
                {
                  color: colors.text,
                },
              ]}
            >
              {filter}
            </Text>

          </TouchableOpacity>

        ))}

      </ScrollView>


      {/* ORDER CARDS */}

      {MOCK_RECENT_ORDERS.map(
        (order) => (

          <Card
            key={order.id}
            style={[
              styles.orderCardFull,
              {
                backgroundColor:
                  colors.surface,
              },
            ]}
          >

            <View
              style={
                styles.orderCardContent
              }
            >

              <View
                style={
                  styles.orderCardHeader
                }
              >

                <View
                  style={
                    styles.orderCustomer
                  }
                >

                  <Text
                    style={[
                      styles.orderCardTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {order.customerName}
                  </Text>

                  <Text
                    style={[
                      styles.orderCardSubtitle,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    Order #{order.id} •{' '}
                    {order.time}
                  </Text>

                </View>


                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        order.status ===
                        'pending'
                          ? '#FF9800'
                          : '#2196F3',
                    },
                  ]}
                >

                  <Text
                    style={
                      styles.statusText
                    }
                  >
                    {order.status ===
                    'pending'
                      ? 'New'
                      : 'Preparing'}
                  </Text>

                </View>

              </View>


              <Divider
                style={
                  styles.orderDivider
                }
              />


              <View
                style={
                  styles.orderDetailRow
                }
              >

                <Text
                  style={[
                    styles.orderDetailLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Meal:
                </Text>

                <Text
                  style={[
                    styles.orderDetailValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {order.mealName}
                </Text>

              </View>


              <View
                style={
                  styles.orderDetailRow
                }
              >

                <Text
                  style={[
                    styles.orderDetailLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Quantity:
                </Text>

                <Text
                  style={[
                    styles.orderDetailValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {order.quantity}
                </Text>

              </View>


              <View
                style={
                  styles.orderDetailRow
                }
              >

                <Text
                  style={[
                    styles.orderDetailLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Total:
                </Text>

                <Text
                  style={[
                    styles.orderDetailValue,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ₹{order.totalPrice}
                </Text>

              </View>


              <View
                style={
                  styles.orderDetailRow
                }
              >

                <Text
                  style={[
                    styles.orderDetailLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Distance:
                </Text>

                <Text
                  style={[
                    styles.orderDetailValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  1.2 km
                </Text>

              </View>


              <View
                style={
                  styles.orderDetailRow
                }
              >

                <Text
                  style={[
                    styles.orderDetailLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Est. Time:
                </Text>

                <Text
                  style={[
                    styles.orderDetailValue,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  25-30 min
                </Text>

              </View>


              {order.status ===
                'pending' && (

                <View
                  style={
                    styles.orderActions
                  }
                >

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.rejectButton,
                    ]}
                  >
                    <Text
                      style={
                        styles.rejectText
                      }
                    >
                      Reject
                    </Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.acceptButton,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.acceptText
                      }
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>

                </View>

              )}


              {order.status ===
                'preparing' && (

                <View
                  style={
                    styles.statusProgress
                  }
                >

                  <View
                    style={
                      styles.progressStep
                    }
                  >

                    <View
                      style={[
                        styles.progressDot,
                        {
                          backgroundColor:
                            '#4CAF50',
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.progressLabel,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      Accepted
                    </Text>

                  </View>


                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor:
                          colors.primary,
                      },
                    ]}
                  />


                  <View
                    style={
                      styles.progressStep
                    }
                  >

                    <View
                      style={[
                        styles.progressDot,
                        {
                          backgroundColor:
                            colors.primary,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.progressLabel,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      Preparing
                    </Text>

                  </View>


                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor:
                          colors.textSecondary +
                          '40',
                      },
                    ]}
                  />


                  <View
                    style={
                      styles.progressStep
                    }
                  >

                    <View
                      style={[
                        styles.progressDot,
                        {
                          backgroundColor:
                            colors.textSecondary +
                            '40',
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.progressLabel,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      Ready
                    </Text>

                  </View>

                </View>

              )}

            </View>

          </Card>

        )
      )}


      <View
        style={styles.bottomPadding}
      />

    </ScrollView>
  );


  // ==================================================
  // MENU
  // ==================================================

  const renderMenu = () => (

    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      <View
        style={styles.menuHeader}
      >

        <Text
          style={[
            styles.pageTitle,
            styles.menuTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Menu Management
        </Text>


        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
          onPress={() => navigation.navigate('AddMeal')}
        >

          <Ionicons
            name="add"
            size={20}
            color="#fff"
          />

          <Text
            style={
              styles.addButtonText
            }
          >
            Add Meal
          </Text>

        </TouchableOpacity>

      </View>


      {[
        {
          id: 1,
          name: 'Dal Chawal',
          price: 140,
          available: true,
          image: '🍛',
        },
        {
          id: 2,
          name: 'Veg Thali',
          price: 180,
          available: true,
          image: '🍱',
        },
        {
          id: 3,
          name: 'Paneer Tikka',
          price: 220,
          available: false,
          image: '🧀',
        },
        {
          id: 4,
          name: 'Biryani',
          price: 200,
          available: true,
          image: '🍚',
        },
      ].map((item) => (

        <Card
          key={item.id}
          style={[
            styles.menuCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <View
            style={styles.menuContent}
          >

            <View
              style={styles.menuInfo}
            >

              <Text
                style={
                  styles.menuEmoji
                }
              >
                {item.image}
              </Text>

              <View
                style={styles.menuDetails}
              >

                <Text
                  style={[
                    styles.menuName,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.menuPrice,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ₹{item.price}
                </Text>

              </View>

            </View>


            <View
              style={
                styles.menuActions
              }
            >

              <Switch
                value={item.available}
                color={colors.primary}
              />

              <IconButton
                icon="pencil"
                size={20}
                iconColor={
                  colors.textSecondary
                }
              />

              <IconButton
                icon="delete"
                size={20}
                iconColor="#F44336"
              />

            </View>

          </View>

        </Card>

      ))}


      <View
        style={styles.bottomPadding}
      />

    </ScrollView>
  );


  // ==================================================
  // EARNINGS
  // ==================================================

  const renderEarnings = () => (

    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      <Text
        style={[
          styles.pageTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Earnings
      </Text>


      {/* PERIOD SELECTOR */}

      <View
        style={styles.periodSelector}
      >

        {[
          'Daily',
          'Weekly',
          'Monthly',
        ].map((period) => (

          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              {
                borderColor:
                  colors.primary,
              },
            ]}
          >

            <Text
              style={[
                styles.periodText,
                {
                  color:
                    colors.primary,
                },
              ]}
            >
              {period}
            </Text>

          </TouchableOpacity>

        ))}

      </View>


      {/* EARNINGS SUMMARY */}

      <Card
        style={[
          styles.earningsCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <Text
          style={[
            styles.earningsLabel,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Today's Earnings
        </Text>

        <Text
          style={[
            styles.earningsAmount,
            {
              color:
                colors.primary,
            },
          ]}
        >
          ₹{MOCK_STATS.todayEarnings}
        </Text>

        <Text
          style={[
            styles.earningsChange,
            {
              color: '#4CAF50',
            },
          ]}
        >
          ↑ 12% from yesterday
        </Text>

      </Card>


      {/* EARNINGS GRID */}

      <View
        style={styles.earningsGrid}
      >

        <Card
          style={[
            styles.earningStatCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <Text
            style={[
              styles.earningStatValue,
              {
                color:
                  colors.text,
              },
            ]}
          >
            ₹{MOCK_STATS.weeklyEarnings}
          </Text>

          <Text
            style={[
              styles.earningStatLabel,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            This Week
          </Text>

        </Card>


        <Card
          style={[
            styles.earningStatCard,
            {
              backgroundColor:
                colors.surface,
            },
          ]}
        >

          <Text
            style={[
              styles.earningStatValue,
              {
                color:
                  colors.text,
              },
            ]}
          >
            ₹{MOCK_STATS.monthlyEarnings}
          </Text>

          <Text
            style={[
              styles.earningStatLabel,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            This Month
          </Text>

        </Card>

      </View>


      {/* STATISTICS */}

      <Card
        style={[
          styles.statsCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <Text
          style={[
            styles.statsTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Statistics
        </Text>


        <View style={styles.statRow}>

          <Text
            style={[
              styles.statRowLabel,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Total Orders
          </Text>

          <Text
            style={[
              styles.statRowValue,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {MOCK_STATS.totalOrders}
          </Text>

        </View>


        <View style={styles.statRow}>

          <Text
            style={[
              styles.statRowLabel,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Avg Order Value
          </Text>

          <Text
            style={[
              styles.statRowValue,
              {
                color:
                  colors.text,
              },
            ]}
          >
            ₹185
          </Text>

        </View>


        <View style={styles.statRow}>

          <Text
            style={[
              styles.statRowLabel,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Platform Commission
          </Text>

          <Text
            style={[
              styles.statRowValue,
              {
                color:
                  colors.text,
              },
            ]}
          >
            ₹245
          </Text>

        </View>


        <Divider
          style={styles.statDivider}
        />


        <View style={styles.statRow}>

          <Text
            style={[
              styles.statRowLabel,
              {
                color: colors.text,
                fontWeight: 'bold',
              },
            ]}
          >
            Net Earnings
          </Text>

          <Text
            style={[
              styles.statRowValue,
              {
                color:
                  colors.primary,
                fontWeight: 'bold',
              },
            ]}
          >
            ₹
            {MOCK_STATS.todayEarnings -
              245}
          </Text>

        </View>

      </Card>


      <View
        style={styles.bottomPadding}
      />

    </ScrollView>
  );


  // ==================================================
  // PROFILE
  // ==================================================

  const renderProfile = () => (

    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      <Text
        style={[
          styles.pageTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Profile
      </Text>


      {/* PROFILE CARD */}

      <Card
        style={[
          styles.profileCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <View
          style={
            styles.profileHeader
          }
        >

          <Avatar.Text
            size={72}
            label="P"
            style={{
              backgroundColor:
                colors.primary,
            }}
          />

          <View
            style={styles.profileInfo}
          >

            <Text
              style={[
                styles.profileName,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Priya's Kitchen
            </Text>

            <Text
              style={[
                styles.profileSubtitle,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Home Chef
            </Text>

            <View
              style={styles.ratingRow}
            >

              <Ionicons
                name="star"
                size={16}
                color="#FFD700"
              />

              <Text
                style={[
                  styles.ratingText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                4.8 (156 reviews)
              </Text>

            </View>

          </View>

        </View>

      </Card>


      {/* PROFILE DETAILS */}

      <Card
        style={[
          styles.detailCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <Text
          style={[
            styles.detailTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Profile Information
        </Text>


        <View style={styles.detailRow}>

          <Ionicons
            name="person"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <View
            style={styles.detailContent}
          >

            <Text
              style={[
                styles.detailLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Name
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Priya Sharma
            </Text>

          </View>

        </View>


        <View style={styles.detailRow}>

          <Ionicons
            name="call"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <View
            style={styles.detailContent}
          >

            <Text
              style={[
                styles.detailLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Phone
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              +91 98765 43210
            </Text>

          </View>

        </View>


        <View style={styles.detailRow}>

          <Ionicons
            name="location"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <View
            style={styles.detailContent}
          >

            <Text
              style={[
                styles.detailLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Address
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Sector 15, Noida, UP
            </Text>

          </View>

        </View>


        <View style={styles.detailRow}>

          <Ionicons
            name="time"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <View
            style={styles.detailContent}
          >

            <Text
              style={[
                styles.detailLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Working Hours
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              9:00 AM - 9:00 PM
            </Text>

          </View>

        </View>


        <View style={styles.detailRow}>

          <Ionicons
            name="restaurant"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <View
            style={styles.detailContent}
          >

            <Text
              style={[
                styles.detailLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Specialty
            </Text>

            <Text
              style={[
                styles.detailValue,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              North Indian, Punjabi
            </Text>

          </View>

        </View>

      </Card>


      {/* SETTINGS */}

      <Card
        style={[
          styles.settingsCard,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <TouchableOpacity
          style={styles.settingRow}
        >

          <Ionicons
            name="create"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <Text
            style={[
              styles.settingText,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Edit Profile
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={
              colors.textSecondary
            }
          />

        </TouchableOpacity>


        <Divider />


        <TouchableOpacity
          style={styles.settingRow}
        >

          <Ionicons
            name="card"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <Text
            style={[
              styles.settingText,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Bank Details
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={
              colors.textSecondary
            }
          />

        </TouchableOpacity>


        <Divider />


        <TouchableOpacity
          style={styles.settingRow}
        >

          <Ionicons
            name="notifications"
            size={20}
            color={
              colors.textSecondary
            }
          />

          <Text
            style={[
              styles.settingText,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Notifications
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={
              colors.textSecondary
            }
          />

        </TouchableOpacity>


        <Divider />


        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => dispatch(logout())}
        >

          <Ionicons
            name="log-out"
            size={20}
            color="#F44336"
          />

          <Text
            style={[
              styles.settingText,
              {
                color: '#F44336',
              },
            ]}
          >
            Logout
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={
              colors.textSecondary
            }
          />

        </TouchableOpacity>

      </Card>


      <View
        style={styles.bottomPadding}
      />

    </ScrollView>
  );


  // ==================================================
  // TAB CONTENT
  // ==================================================

  const renderContent = () => {

    switch (activeTab) {

      case 'dashboard':
        return renderDashboard();

      case 'orders':
        return renderOrders();

      case 'menu':
        return renderMenu();

      case 'earnings':
        return renderEarnings();

      case 'profile':
        return renderProfile();

      default:
        return renderDashboard();

    }

  };


  // ==================================================
  // MAIN UI
  // ==================================================

  return (

    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      edges={[
        'top',
        'left',
        'right',
        'bottom',
      ]}
    >

      {/* CONTENT */}

      <View
        style={styles.contentContainer}
      >
        {renderContent()}
      </View>


      {/* BOTTOM NAVIGATION */}

      <Surface
        style={[
          styles.bottomNav,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        {/* DASHBOARD */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            setActiveTab(
              'dashboard'
            )
          }
        >

          <Ionicons
            name={
              activeTab ===
              'dashboard'
                ? 'grid'
                : 'grid-outline'
            }
            size={24}
            color={
              activeTab ===
              'dashboard'
                ? colors.primary
                : colors.textSecondary
            }
          />

          <Text
            style={[
              styles.navLabel,
              {
                color:
                  activeTab ===
                  'dashboard'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Dashboard
          </Text>

        </TouchableOpacity>


        {/* ORDERS */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            setActiveTab('orders')
          }
        >

          <Ionicons
            name={
              activeTab === 'orders'
                ? 'receipt'
                : 'receipt-outline'
            }
            size={24}
            color={
              activeTab === 'orders'
                ? colors.primary
                : colors.textSecondary
            }
          />

          <Text
            style={[
              styles.navLabel,
              {
                color:
                  activeTab ===
                  'orders'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Orders
          </Text>

        </TouchableOpacity>


        {/* MENU */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            setActiveTab('menu')
          }
        >

          <Ionicons
            name={
              activeTab === 'menu'
                ? 'restaurant'
                : 'restaurant-outline'
            }
            size={24}
            color={
              activeTab === 'menu'
                ? colors.primary
                : colors.textSecondary
            }
          />

          <Text
            style={[
              styles.navLabel,
              {
                color:
                  activeTab === 'menu'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Menu
          </Text>

        </TouchableOpacity>


        {/* EARNINGS */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            setActiveTab('earnings')
          }
        >

          <Ionicons
            name={
              activeTab ===
              'earnings'
                ? 'wallet'
                : 'wallet-outline'
            }
            size={24}
            color={
              activeTab ===
              'earnings'
                ? colors.primary
                : colors.textSecondary
            }
          />

          <Text
            style={[
              styles.navLabel,
              {
                color:
                  activeTab ===
                  'earnings'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Earnings
          </Text>

        </TouchableOpacity>


        {/* PROFILE */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            setActiveTab('profile')
          }
        >

          <Ionicons
            name={
              activeTab ===
              'profile'
                ? 'person'
                : 'person-outline'
            }
            size={24}
            color={
              activeTab ===
              'profile'
                ? colors.primary
                : colors.textSecondary
            }
          />

          <Text
            style={[
              styles.navLabel,
              {
                color:
                  activeTab ===
                  'profile'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Profile
          </Text>

        </TouchableOpacity>

      </Surface>

    </SafeAreaView>
  );
};


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  // -----------------------------------------------
  // MAIN
  // -----------------------------------------------

  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
  },


  // -----------------------------------------------
  // SCROLL CONTENT
  // -----------------------------------------------

  tabContent: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },


  // -----------------------------------------------
  // HEADER
  // -----------------------------------------------

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 20,

    gap: 12,
  },

  headerTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  welcomeText: {
    fontSize: 14,
    marginBottom: 2,
  },

  kitchenName: {
    fontSize: 22,
    fontWeight: 'bold',
  },


  // -----------------------------------------------
  // ONLINE TOGGLE
  // -----------------------------------------------

  toggleCard: {
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },

  toggleContent: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    padding: 16,

    gap: 12,
  },

  toggleInfo: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,

    gap: 12,
  },

  toggleText: {
    flex: 1,

    gap: 2,
  },

  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  toggleSubtitle: {
    fontSize: 12,
  },


  // -----------------------------------------------
  // SECTIONS
  // -----------------------------------------------

  sectionTitle: {
    fontSize: 18,

    fontWeight: 'bold',

    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: 12,

    gap: 12,
  },

  seeAll: {
    fontSize: 14,

    fontWeight: '600',
  },


  // -----------------------------------------------
  // STATS
  // -----------------------------------------------

  statsGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent:
      'space-between',

    marginBottom: 24,

    rowGap: 12,
  },

  statCard: {
    width: '48.5%',

    borderRadius: 12,

    elevation: 2,
  },

  statContent: {
    padding: 14,

    alignItems: 'center',

    gap: 7,
  },

  statValue: {
    fontSize: 23,

    fontWeight: 'bold',
  },

  statLabel: {
    fontSize: 12,

    textAlign: 'center',
  },


  // -----------------------------------------------
  // ORDERS
  // -----------------------------------------------

  orderCard: {
    borderRadius: 12,

    marginBottom: 12,

    elevation: 2,
  },

  orderContent: {
    padding: 16,
  },

  orderHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'flex-start',

    gap: 12,
  },

  orderCustomer: {
    flex: 1,

    minWidth: 0,
  },

  customerName: {
    fontSize: 16,

    fontWeight: '600',
  },

  orderId: {
    fontSize: 12,

    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,

    paddingVertical: 4,

    borderRadius: 12,

    alignSelf: 'flex-start',
  },

  statusText: {
    color: '#fff',

    fontSize: 11,

    fontWeight: '600',
  },

  orderDivider: {
    marginVertical: 12,
  },

  orderDetails: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    gap: 12,
  },

  orderMeal: {
    flex: 1,

    fontSize: 14,

    fontWeight: '500',
  },

  orderPrice: {
    fontSize: 16,

    fontWeight: 'bold',
  },

  orderActions: {
    flexDirection: 'row',

    gap: 12,

    marginTop: 12,
  },

  actionButton: {
    flex: 1,

    paddingVertical: 10,

    borderRadius: 8,

    alignItems: 'center',

    justifyContent: 'center',
  },

  rejectButton: {
    backgroundColor: '#F4433620',

    borderWidth: 1,

    borderColor: '#F44336',
  },

  rejectText: {
    color: '#F44336',

    fontWeight: '600',
  },

  acceptButton: {
    minHeight: 40,
  },

  acceptText: {
    color: '#fff',

    fontWeight: '600',
  },


  // -----------------------------------------------
  // PAGE TITLE
  // -----------------------------------------------

  pageTitle: {
    fontSize: 24,

    fontWeight: 'bold',

    marginBottom: 20,
  },


  // -----------------------------------------------
  // FILTERS
  // -----------------------------------------------

  filterScroll: {
    marginBottom: 16,
  },

  filterContent: {
    paddingRight: 8,
  },

  filterChip: {
    paddingHorizontal: 16,

    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: '#E0E0E0',

    marginRight: 8,
  },

  filterText: {
    fontSize: 14,

    fontWeight: '500',
  },


  // -----------------------------------------------
  // FULL ORDER CARD
  // -----------------------------------------------

  orderCardFull: {
    borderRadius: 12,

    marginBottom: 16,

    elevation: 2,
  },

  orderCardContent: {
    padding: 16,
  },

  orderCardHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'flex-start',

    gap: 12,
  },

  orderCardTitle: {
    fontSize: 16,

    fontWeight: '600',
  },

  orderCardSubtitle: {
    fontSize: 12,

    marginTop: 2,
  },

  orderDetailRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    paddingVertical: 6,

    gap: 12,
  },

  orderDetailLabel: {
    fontSize: 14,
  },

  orderDetailValue: {
    fontSize: 14,

    fontWeight: '500',

    textAlign: 'right',

    flexShrink: 1,
  },


  // -----------------------------------------------
  // ORDER PROGRESS
  // -----------------------------------------------

  statusProgress: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 16,

    paddingVertical: 8,
  },

  progressStep: {
    alignItems: 'center',

    gap: 4,

    minWidth: 55,
  },

  progressDot: {
    width: 12,

    height: 12,

    borderRadius: 6,
  },

  progressLine: {
    flex: 1,

    maxWidth: 45,

    minWidth: 20,

    height: 2,

    marginHorizontal: 4,
  },

  progressLabel: {
    fontSize: 10,

    textAlign: 'center',
  },


  // -----------------------------------------------
  // MENU
  // -----------------------------------------------

  menuHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: 20,

    gap: 10,
  },

  menuTitle: {
    flex: 1,

    marginBottom: 0,
  },

  addButton: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    paddingHorizontal: 14,

    paddingVertical: 9,

    borderRadius: 8,
  },

  addButtonText: {
    color: '#fff',

    fontWeight: '600',

    fontSize: 13,
  },

  menuCard: {
    borderRadius: 12,

    marginBottom: 12,

    elevation: 2,
  },

  menuContent: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    padding: 14,

    gap: 8,
  },

  menuInfo: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,

    minWidth: 0,

    gap: 12,
  },

  menuEmoji: {
    fontSize: 32,
  },

  menuDetails: {
    flex: 1,

    gap: 2,
  },

  menuName: {
    fontSize: 16,

    fontWeight: '600',
  },

  menuPrice: {
    fontSize: 14,

    fontWeight: '500',
  },

  menuActions: {
    flexDirection: 'row',

    alignItems: 'center',

    flexShrink: 0,
  },


  // -----------------------------------------------
  // EARNINGS
  // -----------------------------------------------

  periodSelector: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 20,
  },

  periodButton: {
    flex: 1,

    paddingVertical: 10,

    borderRadius: 8,

    borderWidth: 1,

    alignItems: 'center',
  },

  periodText: {
    fontWeight: '600',
  },

  earningsCard: {
    borderRadius: 12,

    padding: 20,

    marginBottom: 16,

    elevation: 2,

    alignItems: 'center',
  },

  earningsLabel: {
    fontSize: 14,

    marginBottom: 8,
  },

  earningsAmount: {
    fontSize: 36,

    fontWeight: 'bold',

    marginBottom: 4,
  },

  earningsChange: {
    fontSize: 14,
  },

  earningsGrid: {
    flexDirection: 'row',

    gap: 12,

    marginBottom: 16,
  },

  earningStatCard: {
    flex: 1,

    borderRadius: 12,

    padding: 16,

    elevation: 2,

    alignItems: 'center',
  },

  earningStatValue: {
    fontSize: 20,

    fontWeight: 'bold',

    marginBottom: 4,
  },

  earningStatLabel: {
    fontSize: 12,

    textAlign: 'center',
  },

  statsCard: {
    borderRadius: 12,

    padding: 16,

    elevation: 2,
  },

  statsTitle: {
    fontSize: 16,

    fontWeight: 'bold',

    marginBottom: 12,
  },

  statRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    paddingVertical: 8,

    gap: 12,
  },

  statRowLabel: {
    fontSize: 14,

    flex: 1,
  },

  statRowValue: {
    fontSize: 14,

    fontWeight: '500',
  },

  statDivider: {
    marginVertical: 8,
  },


  // -----------------------------------------------
  // PROFILE
  // -----------------------------------------------

  profileCard: {
    borderRadius: 12,

    padding: 20,

    marginBottom: 16,

    elevation: 2,
  },

  profileHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 16,
  },

  profileInfo: {
    flex: 1,

    gap: 4,

    minWidth: 0,
  },

  profileName: {
    fontSize: 20,

    fontWeight: 'bold',
  },

  profileSubtitle: {
    fontSize: 14,
  },

  ratingRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,
  },

  ratingText: {
    fontSize: 14,
  },

  detailCard: {
    borderRadius: 12,

    padding: 16,

    marginBottom: 16,

    elevation: 2,
  },

  detailTitle: {
    fontSize: 16,

    fontWeight: 'bold',

    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    paddingVertical: 12,
  },

  detailContent: {
    flex: 1,

    gap: 2,

    minWidth: 0,
  },

  detailLabel: {
    fontSize: 12,
  },

  detailValue: {
    fontSize: 14,

    fontWeight: '500',
  },

  settingsCard: {
    borderRadius: 12,

    elevation: 2,

    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    padding: 16,
  },

  settingText: {
    flex: 1,

    fontSize: 14,

    fontWeight: '500',
  },


  // -----------------------------------------------
  // BOTTOM NAVIGATION
  // -----------------------------------------------

  bottomNav: {
    flexDirection: 'row',

    paddingVertical: 8,

    paddingHorizontal: 4,

    elevation: 8,

    minHeight: 64,
  },

  navItem: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    gap: 2,

    paddingVertical: 4,
  },

  navLabel: {
    fontSize: 11,
  },


  // -----------------------------------------------
  // BOTTOM PADDING
  // -----------------------------------------------

  bottomPadding: {
    height: 24,
  },

});


export default CookDashboardScreen;