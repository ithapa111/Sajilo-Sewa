window.SAJILO_SEED_DATA = {
  "platform": {
    "brand": {
      "name": "Sazilo Sewa",
      "tagline": "Move people, meals, and packages with one local platform",
      "currency": "USD",
      "defaultLocale": "en-US",
      "timezone": "America/Chicago"
    },
    "serviceCategories": [
      {
        "id": "svc_ride",
        "name": "Ride",
        "description": "On-demand city rides for solo and group travel",
        "status": "active"
      },
      {
        "id": "svc_food",
        "name": "Food",
        "description": "Restaurant ordering with live delivery tracking",
        "status": "active"
      },
      {
        "id": "svc_courier",
        "name": "Courier",
        "description": "Send small packages across the city",
        "status": "active"
      }
    ],
    "cities": [
      {
        "id": "city_chi",
        "name": "Chicago",
        "country": "USA",
        "center": {
          "lat": 41.8781,
          "lng": -87.6298
        },
        "status": "active"
      }
    ],
    "zones": [
      {
        "id": "zone_loop",
        "cityId": "city_chi",
        "name": "Downtown Loop",
        "type": "high-demand",
        "surgeEligible": true
      },
      {
        "id": "zone_north",
        "cityId": "city_chi",
        "name": "North Side",
        "type": "residential-mixed",
        "surgeEligible": true
      },
      {
        "id": "zone_west",
        "cityId": "city_chi",
        "name": "West Corridor",
        "type": "airport-connector",
        "surgeEligible": true
      }
    ],
    "paymentMethods": [
      {
        "id": "pay_card_visa",
        "type": "card",
        "label": "Visa ending 4242",
        "provider": "Stripe",
        "isDefault": true
      },
      {
        "id": "pay_wallet",
        "type": "wallet",
        "label": "Sazilo Wallet",
        "provider": "internal",
        "isDefault": false
      },
      {
        "id": "pay_cash",
        "type": "cash",
        "label": "Cash",
        "provider": "offline",
        "isDefault": false
      }
    ],
    "promotions": [
      {
        "id": "promo_first_ride",
        "service": "ride",
        "code": "HELLOMOVE",
        "discountType": "flat",
        "discountValue": 8,
        "maxDiscount": 8,
        "eligibleUserType": "new",
        "status": "active"
      },
      {
        "id": "promo_lunch_dash",
        "service": "food",
        "code": "LUNCH10",
        "discountType": "percent",
        "discountValue": 10,
        "maxDiscount": 12,
        "eligibleUserType": "all",
        "status": "active"
      }
    ],
    "supportIssueTypes": [
      "driver_late",
      "wrong_route",
      "unsafe_behavior",
      "payment_issue",
      "lost_item",
      "wrong_order",
      "missing_item",
      "cold_food",
      "courier_no_show",
      "refund_request"
    ],
    "notificationTemplates": [
      {
        "id": "notif_driver_arriving",
        "channel": "push",
        "event": "ride.driver_arriving",
        "title": "Driver is arriving",
        "body": "Your driver will reach you shortly."
      },
      {
        "id": "notif_order_preparing",
        "channel": "push",
        "event": "food.order_preparing",
        "title": "Order is being prepared",
        "body": "The restaurant has started making your order."
      }
    ]
  },
  "users": {
    "riders": [
      {
        "id": "rider_001",
        "fullName": "Maya Thompson",
        "phone": "+1-312-555-0101",
        "email": "maya@example.com",
        "rating": 4.9,
        "walletBalance": 18.5,
        "savedPlaces": [
          {
            "label": "Home",
            "address": "1900 N Sheffield Ave, Chicago, IL",
            "lat": 41.9161,
            "lng": -87.6536
          },
          {
            "label": "Work",
            "address": "233 S Wacker Dr, Chicago, IL",
            "lat": 41.8789,
            "lng": -87.6359
          }
        ],
        "emergencyContact": {
          "name": "Noah Thompson",
          "phone": "+1-312-555-0102"
        }
      },
      {
        "id": "rider_002",
        "fullName": "Daniel Brooks",
        "phone": "+1-312-555-0103",
        "email": "daniel@example.com",
        "rating": 4.8,
        "walletBalance": 6.25,
        "savedPlaces": []
      }
    ],
    "drivers": [
      {
        "id": "driver_001",
        "fullName": "Jorge Alvarez",
        "phone": "+1-312-555-0201",
        "rating": 4.96,
        "completedTrips": 3248,
        "acceptanceRate": 0.91,
        "cancellationRate": 0.03,
        "onlineStatus": "online",
        "currentZoneId": "zone_loop",
        "documents": {
          "licenseVerified": true,
          "insuranceVerified": true,
          "backgroundCheckStatus": "approved"
        },
        "vehicleId": "veh_001"
      },
      {
        "id": "driver_002",
        "fullName": "Aisha Patel",
        "phone": "+1-312-555-0202",
        "rating": 4.91,
        "completedTrips": 1884,
        "acceptanceRate": 0.89,
        "cancellationRate": 0.04,
        "onlineStatus": "busy",
        "currentZoneId": "zone_north",
        "documents": {
          "licenseVerified": true,
          "insuranceVerified": true,
          "backgroundCheckStatus": "approved"
        },
        "vehicleId": "veh_002"
      }
    ],
    "customers": [
      {
        "id": "cust_001",
        "fullName": "Maya Thompson",
        "phone": "+1-312-555-0101",
        "email": "maya@example.com",
        "favoriteCuisineTags": ["Nepali", "Burgers", "Thai"],
        "defaultPaymentMethodId": "pay_card_visa"
      },
      {
        "id": "cust_002",
        "fullName": "Elena Cruz",
        "phone": "+1-312-555-0301",
        "email": "elena@example.com",
        "favoriteCuisineTags": ["Pizza", "Indian"],
        "defaultPaymentMethodId": "pay_wallet"
      }
    ],
    "couriers": [
      {
        "id": "courier_001",
        "fullName": "Samir Khan",
        "phone": "+1-312-555-0401",
        "rating": 4.88,
        "vehicleType": "bike",
        "onlineStatus": "online",
        "currentZoneId": "zone_loop",
        "completedDeliveries": 942
      },
      {
        "id": "courier_002",
        "fullName": "Lena Morris",
        "phone": "+1-312-555-0402",
        "rating": 4.93,
        "vehicleType": "scooter",
        "onlineStatus": "online",
        "currentZoneId": "zone_north",
        "completedDeliveries": 1244
      }
    ]
  },
  "rideshare": {
    "serviceTiers": [
      {
        "id": "tier_go",
        "name": "Sazilo Go",
        "capacity": 4,
        "baseFare": 2.5,
        "perMile": 1.35,
        "perMinute": 0.32,
        "minimumFare": 6.5,
        "bookingFee": 1.25,
        "cancellationFee": 4
      },
      {
        "id": "tier_plus",
        "name": "Sazilo Plus",
        "capacity": 6,
        "baseFare": 4.5,
        "perMile": 1.9,
        "perMinute": 0.45,
        "minimumFare": 9,
        "bookingFee": 1.75,
        "cancellationFee": 5
      },
      {
        "id": "tier_exec",
        "name": "Sazilo Exec",
        "capacity": 4,
        "baseFare": 8,
        "perMile": 3.1,
        "perMinute": 0.72,
        "minimumFare": 18,
        "bookingFee": 2.5,
        "cancellationFee": 8
      }
    ],
    "vehicles": [
      {
        "id": "veh_001",
        "driverId": "driver_001",
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
        "color": "Silver",
        "plateNumber": "SJL-2041",
        "tierIds": ["tier_go", "tier_plus"]
      },
      {
        "id": "veh_002",
        "driverId": "driver_002",
        "make": "Honda",
        "model": "Pilot",
        "year": 2023,
        "color": "Black",
        "plateNumber": "SJL-1187",
        "tierIds": ["tier_plus"]
      }
    ],
    "surgeRules": [
      {
        "id": "surge_001",
        "zoneId": "zone_loop",
        "timeWindow": "07:00-09:30",
        "multiplier": 1.4,
        "reason": "commuter_peak"
      },
      {
        "id": "surge_002",
        "zoneId": "zone_west",
        "timeWindow": "16:30-19:00",
        "multiplier": 1.6,
        "reason": "airport_rush"
      }
    ],
    "rideRequests": [
      {
        "id": "rq_001",
        "riderId": "rider_001",
        "requestedTierId": "tier_go",
        "pickup": {
          "address": "875 N Michigan Ave, Chicago, IL",
          "lat": 41.8988,
          "lng": -87.6242
        },
        "dropoff": {
          "address": "233 S Wacker Dr, Chicago, IL",
          "lat": 41.8789,
          "lng": -87.6359
        },
        "estimatedDistanceMiles": 2.9,
        "estimatedDurationMinutes": 14,
        "estimatedFare": 13.42,
        "surgeMultiplier": 1.2,
        "status": "searching",
        "requestedAt": "2026-04-14T18:20:00-05:00"
      }
    ],
    "trips": [
      {
        "id": "trip_001",
        "riderId": "rider_002",
        "driverId": "driver_001",
        "vehicleId": "veh_001",
        "tierId": "tier_go",
        "status": "completed",
        "pickup": {
          "address": "150 W Adams St, Chicago, IL",
          "lat": 41.8795,
          "lng": -87.6339
        },
        "dropoff": {
          "address": "1035 W Van Buren St, Chicago, IL",
          "lat": 41.8761,
          "lng": -87.6524
        },
        "distanceMiles": 2.1,
        "durationMinutes": 11,
        "fare": {
          "baseFare": 2.5,
          "distanceCharge": 2.84,
          "timeCharge": 3.52,
          "bookingFee": 1.25,
          "surgeCharge": 0,
          "tip": 2,
          "discount": 0,
          "tax": 1.07,
          "total": 13.18
        },
        "timeline": [
          {
            "status": "driver_assigned",
            "timestamp": "2026-04-14T08:10:00-05:00"
          },
          {
            "status": "driver_arrived",
            "timestamp": "2026-04-14T08:14:00-05:00"
          },
          {
            "status": "trip_started",
            "timestamp": "2026-04-14T08:16:00-05:00"
          },
          {
            "status": "trip_completed",
            "timestamp": "2026-04-14T08:27:00-05:00"
          }
        ],
        "paymentMethodId": "pay_card_visa",
        "riderRating": 5,
        "driverRating": 5,
        "safetyFeaturesUsed": []
      },
      {
        "id": "trip_002",
        "riderId": "rider_001",
        "driverId": "driver_002",
        "vehicleId": "veh_002",
        "tierId": "tier_plus",
        "status": "in_progress",
        "pickup": {
          "address": "1901 W Madison St, Chicago, IL",
          "lat": 41.8815,
          "lng": -87.6755
        },
        "dropoff": {
          "address": "5700 S DuSable Lake Shore Dr, Chicago, IL",
          "lat": 41.7925,
          "lng": -87.5831
        },
        "distanceMiles": 8.4,
        "durationMinutes": 26,
        "fare": {
          "baseFare": 4.5,
          "distanceCharge": 15.96,
          "timeCharge": 11.7,
          "bookingFee": 1.75,
          "surgeCharge": 5.5,
          "tip": 0,
          "discount": 3,
          "tax": 2.84,
          "total": 39.25
        },
        "timeline": [
          {
            "status": "driver_assigned",
            "timestamp": "2026-04-14T17:52:00-05:00"
          },
          {
            "status": "trip_started",
            "timestamp": "2026-04-14T18:03:00-05:00"
          }
        ],
        "paymentMethodId": "pay_wallet",
        "riderRating": null,
        "driverRating": null,
        "safetyFeaturesUsed": ["share_trip"]
      }
    ],
    "safetyEvents": [
      {
        "id": "safe_001",
        "tripId": "trip_002",
        "eventType": "share_trip",
        "triggeredByUserId": "rider_001",
        "timestamp": "2026-04-14T18:05:00-05:00",
        "status": "completed"
      }
    ]
  },
  "foodDelivery": {
    "deliveryPricingRules": [
      {
        "id": "fdp_001",
        "baseFee": 2.49,
        "perMile": 0.85,
        "serviceFeePercent": 0.12,
        "smallOrderFee": 2,
        "freeDeliveryThreshold": 25
      }
    ],
    "restaurants": [
      {
        "id": "rest_001",
        "name": "Himal Street Kitchen",
        "cuisineTags": ["Nepali", "Momo", "Noodles"],
        "rating": 4.7,
        "priceLevel": 2,
        "address": "825 W Randolph St, Chicago, IL",
        "zoneId": "zone_loop",
        "deliveryRadiusMiles": 4.5,
        "avgPrepTimeMinutes": 22,
        "isOpen": true,
        "hours": {
          "mon": "11:00-22:00",
          "tue": "11:00-22:00",
          "wed": "11:00-22:00",
          "thu": "11:00-22:00",
          "fri": "11:00-23:00",
          "sat": "11:00-23:00",
          "sun": "12:00-21:00"
        }
      },
      {
        "id": "rest_002",
        "name": "Lakeview Burger House",
        "cuisineTags": ["Burgers", "Fries", "Shakes"],
        "rating": 4.5,
        "priceLevel": 2,
        "address": "2932 N Broadway, Chicago, IL",
        "zoneId": "zone_north",
        "deliveryRadiusMiles": 5,
        "avgPrepTimeMinutes": 18,
        "isOpen": true,
        "hours": {
          "mon": "10:30-23:00",
          "tue": "10:30-23:00",
          "wed": "10:30-23:00",
          "thu": "10:30-23:00",
          "fri": "10:30-00:00",
          "sat": "10:30-00:00",
          "sun": "11:00-22:00"
        }
      }
    ],
    "menuCategories": [
      {
        "id": "mc_001",
        "restaurantId": "rest_001",
        "name": "Momos",
        "sortOrder": 1
      },
      {
        "id": "mc_002",
        "restaurantId": "rest_001",
        "name": "Noodles",
        "sortOrder": 2
      },
      {
        "id": "mc_003",
        "restaurantId": "rest_002",
        "name": "Signature Burgers",
        "sortOrder": 1
      }
    ],
    "menuItems": [
      {
        "id": "item_001",
        "restaurantId": "rest_001",
        "categoryId": "mc_001",
        "name": "Chicken Steam Momo",
        "description": "Steamed dumplings with spiced chicken filling",
        "price": 12.5,
        "isPopular": true,
        "isAvailable": true,
        "modifierGroupIds": ["mod_001"]
      },
      {
        "id": "item_002",
        "restaurantId": "rest_001",
        "categoryId": "mc_002",
        "name": "Chow Mein",
        "description": "Stir-fried noodles with vegetables and sauce",
        "price": 13.25,
        "isPopular": false,
        "isAvailable": true,
        "modifierGroupIds": ["mod_002"]
      },
      {
        "id": "item_003",
        "restaurantId": "rest_002",
        "categoryId": "mc_003",
        "name": "Classic Smash Burger",
        "description": "Double patty burger with cheese and house sauce",
        "price": 14.75,
        "isPopular": true,
        "isAvailable": true,
        "modifierGroupIds": ["mod_003"]
      }
    ],
    "modifierGroups": [
      {
        "id": "mod_001",
        "name": "Spice Level",
        "selectionType": "single",
        "required": true,
        "options": [
          {
            "id": "mod_001_opt_1",
            "label": "Mild",
            "price": 0
          },
          {
            "id": "mod_001_opt_2",
            "label": "Medium",
            "price": 0
          },
          {
            "id": "mod_001_opt_3",
            "label": "Hot",
            "price": 0
          }
        ]
      },
      {
        "id": "mod_002",
        "name": "Add Protein",
        "selectionType": "single",
        "required": false,
        "options": [
          {
            "id": "mod_002_opt_1",
            "label": "Chicken",
            "price": 3
          },
          {
            "id": "mod_002_opt_2",
            "label": "Paneer",
            "price": 2.5
          }
        ]
      },
      {
        "id": "mod_003",
        "name": "Extras",
        "selectionType": "multi",
        "required": false,
        "options": [
          {
            "id": "mod_003_opt_1",
            "label": "Bacon",
            "price": 2.25
          },
          {
            "id": "mod_003_opt_2",
            "label": "Avocado",
            "price": 1.75
          },
          {
            "id": "mod_003_opt_3",
            "label": "Extra Cheese",
            "price": 1.5
          }
        ]
      }
    ],
    "orders": [
      {
        "id": "ord_001",
        "customerId": "cust_001",
        "restaurantId": "rest_001",
        "courierId": "courier_001",
        "status": "on_the_way",
        "deliveryAddress": {
          "address": "233 S Wacker Dr, Chicago, IL",
          "lat": 41.8789,
          "lng": -87.6359
        },
        "items": [
          {
            "itemId": "item_001",
            "quantity": 2,
            "selectedModifiers": ["mod_001_opt_2"],
            "lineTotal": 25
          },
          {
            "itemId": "item_002",
            "quantity": 1,
            "selectedModifiers": ["mod_002_opt_1"],
            "lineTotal": 16.25
          }
        ],
        "pricing": {
          "subtotal": 41.25,
          "deliveryFee": 3.95,
          "serviceFee": 4.95,
          "tax": 4.12,
          "courierTip": 5,
          "discount": 4.13,
          "total": 55.14
        },
        "timeline": [
          {
            "status": "placed",
            "timestamp": "2026-04-14T12:05:00-05:00"
          },
          {
            "status": "accepted",
            "timestamp": "2026-04-14T12:07:00-05:00"
          },
          {
            "status": "preparing",
            "timestamp": "2026-04-14T12:10:00-05:00"
          },
          {
            "status": "picked_up",
            "timestamp": "2026-04-14T12:31:00-05:00"
          },
          {
            "status": "on_the_way",
            "timestamp": "2026-04-14T12:33:00-05:00"
          }
        ],
        "paymentMethodId": "pay_card_visa",
        "customerRating": null
      },
      {
        "id": "ord_002",
        "customerId": "cust_002",
        "restaurantId": "rest_002",
        "courierId": "courier_002",
        "status": "delivered",
        "deliveryAddress": {
          "address": "755 W Belmont Ave, Chicago, IL",
          "lat": 41.94,
          "lng": -87.6473
        },
        "items": [
          {
            "itemId": "item_003",
            "quantity": 2,
            "selectedModifiers": ["mod_003_opt_1", "mod_003_opt_3"],
            "lineTotal": 37
          }
        ],
        "pricing": {
          "subtotal": 37,
          "deliveryFee": 2.99,
          "serviceFee": 4.44,
          "tax": 3.51,
          "courierTip": 4,
          "discount": 0,
          "total": 51.94
        },
        "timeline": [
          {
            "status": "placed",
            "timestamp": "2026-04-13T19:18:00-05:00"
          },
          {
            "status": "accepted",
            "timestamp": "2026-04-13T19:19:00-05:00"
          },
          {
            "status": "preparing",
            "timestamp": "2026-04-13T19:23:00-05:00"
          },
          {
            "status": "picked_up",
            "timestamp": "2026-04-13T19:40:00-05:00"
          },
          {
            "status": "delivered",
            "timestamp": "2026-04-13T19:57:00-05:00"
          }
        ],
        "paymentMethodId": "pay_wallet",
        "customerRating": 5
      }
    ]
  },
  "courierDelivery": {
    "packageTypes": [
      {
        "id": "pkg_docs",
        "name": "Documents",
        "maxWeightKg": 1
      },
      {
        "id": "pkg_small",
        "name": "Small Parcel",
        "maxWeightKg": 5
      }
    ],
    "deliveries": [
      {
        "id": "cd_001",
        "senderUserId": "rider_001",
        "courierId": "courier_002",
        "packageTypeId": "pkg_small",
        "pickupAddress": "233 S Wacker Dr, Chicago, IL",
        "dropoffAddress": "401 N Michigan Ave, Chicago, IL",
        "status": "assigned",
        "quotedPrice": 14.5,
        "scheduledAt": "2026-04-14T20:00:00-05:00"
      }
    ]
  },
  "analytics": {
    "adminDashboard": {
      "dailyRideRequests": 428,
      "dailyCompletedRides": 391,
      "dailyFoodOrders": 274,
      "dailyCourierDeliveries": 39,
      "activeDrivers": 86,
      "activeCouriers": 41,
      "avgRideEtaMinutes": 4.8,
      "avgFoodDeliveryMinutes": 31.2,
      "grossMerchandiseValue": 18426.5
    }
  }
}
;
