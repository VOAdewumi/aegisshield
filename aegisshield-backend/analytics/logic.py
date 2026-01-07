####################################################################################
##################################### formula ######################################
####################################################################################

#weekly Intensity index I = Intel_Conf * ((A * T_w) + (B * (C / (C + K)) + (D * (log(F + 1) / log(F_max + 1))))
#Hotspot H_t = (I_t * alpha) + (H_(t-1) * (1 - alpha))
# A, B and D are weighted coefficients
# C is the incident count or cases
# F is the number of fatalities
# F_max is the maximum amount of fatalities
# K is a scaling constant for case count
# T_w is the threat weight based on threat type
# alpha is the smoothing factor for hotspot calculation
# t is the current week
# t-1 is the previous week
# I_t is the intensity index for the current week
# H_t is the hotspot for the current week
# H_(t-1) is the hotspot for the previous week
# Intel_Conf is the intelligence confidence score

#####################################################################################
#####################################################################################
#####################################################################################

import math
import numpy as np


Threat_Weights = {
  'Civil Unrest': 0.7,
  'Insurgency': 0.9,
  'Border Dispute': 0.5,
  'Terrorism': 0.9,
  'Cyber Warfare': 0.8,
  'State Conflict': 0.6
}

A = 0.3
B = 0.3
D = 0.4

K = 50
F_MAX = 2500
ALPHA = 0.2

def calculate_weekly_intensity(cases, fatalities, threat_type, confidence):
  tw = Threat_Weights.get(threat_type, 0.0)
  case_score = (cases/(cases + K))
  fatality_score = (math.log(fatalities + 1) / math.log(F_MAX + 1))
  weighted_sum =  ((A * tw) + (B * case_score) + (D * fatality_score))
  intensity_index = confidence * weighted_sum
  
  return round(intensity_index * 100, 2)

def calculate_hotspot_intensity(current_intensity_index, previous_hotspot):
  hotspot_intensity = (current_intensity_index * ALPHA) + (previous_hotspot * (1 - ALPHA))
  return round(hotspot_intensity, 2)