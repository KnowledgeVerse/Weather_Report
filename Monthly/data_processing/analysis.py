#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bihar Meteorological Centre - Weather Data Analysis Module
Advanced data processing and statistical analysis for monthly weather reports
"""

import pandas as pd
import numpy as np
from datetime import datetime
import json
import re

class WeatherAnalyzer:
    """Main class for weather data analysis"""

    def __init__(self):
        self.data = {
            'daily_max': None,
            'daily_min': None,
            'rainfall': None,
            'five_year': None
        }
        self.results = {}

    def load_excel_data(self, file_path):
        """Load data from Excel file with multiple sheets"""
        try:
            xl = pd.ExcelFile(file_path)
            sheets = xl.sheet_names

            # Load main sheets
            if 'DAILY MAX' in sheets:
                self.data['daily_max'] = pd.read_excel(file_path, sheet_name='DAILY MAX')
            if 'daily min' in sheets:
                self.data['daily_min'] = pd.read_excel(file_path, sheet_name='daily min')
            if 'RAINFALL' in sheets:
                self.data['rainfall'] = pd.read_excel(file_path, sheet_name='RAINFALL')

            # Load 5-year comparison data
            if 'FTO' in sheets:
                self.data['five_year'] = pd.read_excel(file_path, sheet_name='FTO')
            if 'PTO' in sheets:
                self.data['pto'] = pd.read_excel(file_path, sheet_name='PTO')

            return True, "Data loaded successfully"
        except Exception as e:
            return False, str(e)

    def load_csv_data(self, max_file=None, min_file=None, rain_file=None):
        """Load data from CSV files"""
        try:
            if max_file:
                self.data['daily_max'] = pd.read_csv(max_file)
            if min_file:
                self.data['daily_min'] = pd.read_csv(min_file)
            if rain_file:
                self.data['rainfall'] = pd.read_csv(rain_file)
            return True, "CSV data loaded successfully"
        except Exception as e:
            return False, str(e)

    def analyze_temperature(self, df, temp_type='max'):
        """Analyze temperature data"""
        if df is None or df.empty:
            return {}

        # First column is station name
        station_col = df.columns[0]
        data_cols = df.columns[1:]  # Day columns

        results = {
            'highest_avg': {'value': float('-inf'), 'station': ''},
            'lowest_avg': {'value': float('inf'), 'station': ''},
            'highest_single': {'value': float('-inf'), 'station': '', 'day': ''},
            'lowest_single': {'value': float('inf'), 'station': '', 'day': ''},
            'station_stats': {}
        }

        for idx, row in df.iterrows():
            station = str(row[station_col]).strip()
            if pd.isna(station) or station == '':
                continue

            # Get numeric values
            values = []
            for col in data_cols:
                val = row[col]
                if pd.notna(val) and isinstance(val, (int, float)):
                    values.append(val)

            if not values:
                continue

            avg_temp = np.mean(values)
            max_temp = np.max(values)
            min_temp = np.min(values)

            # Find day of max/min
            max_day = ''
            min_day = ''
            for col in data_cols:
                if row[col] == max_temp:
                    max_day = str(col)
                    break
            for col in data_cols:
                if row[col] == min_temp:
                    min_day = str(col)
                    break

            # Store station stats
            results['station_stats'][station] = {
                'average': round(avg_temp, 1),
                'maximum': round(max_temp, 1),
                'minimum': round(min_temp, 1),
                'max_day': max_day,
                'min_day': min_day
            }

            # Update global stats
            if avg_temp > results['highest_avg']['value']:
                results['highest_avg'] = {'value': round(avg_temp, 1), 'station': station}
            if avg_temp < results['lowest_avg']['value']:
                results['lowest_avg'] = {'value': round(avg_temp, 1), 'station': station}
            if max_temp > results['highest_single']['value']:
                results['highest_single'] = {'value': round(max_temp, 1), 'station': station, 'day': max_day}
            if min_temp < results['lowest_single']['value']:
                results['lowest_single'] = {'value': round(min_temp, 1), 'station': station, 'day': min_day}

        return results

    def analyze_rainfall(self, df):
        """Analyze rainfall data"""
        if df is None or df.empty:
            return {}

        station_col = df.columns[0]
        data_cols = df.columns[1:-2]  # Exclude TOTAL and max columns

        results = {
            'total_rainfall': 0,
            'station_rainfall': [],
            'highest_rainfall': {'value': 0, 'station': ''}
        }

        for idx, row in df.iterrows():
            station = str(row[station_col]).strip()
            if pd.isna(station) or station == '':
                continue

            # Calculate total
            total = 0
            for col in data_cols:
                val = row[col]
                if pd.notna(val) and isinstance(val, (int, float)):
                    total += val

            # Check for explicit total column
            if 'TOTAL' in df.columns:
                total = row['TOTAL'] if pd.notna(row['TOTAL']) else total

            results['station_rainfall'].append({
                'station': station,
                'rainfall': round(total, 1)
            })
            results['total_rainfall'] += total

            if total > results['highest_rainfall']['value']:
                results['highest_rainfall'] = {'value': round(total, 1), 'station': station}

        results['total_rainfall'] = round(results['total_rainfall'], 1)
        results['station_rainfall'].sort(key=lambda x: x['rainfall'], reverse=True)

        return results

    def get_patna_stats(self, max_results, min_results):
        """Get specific statistics for Patna"""
        patna_stats = {
            'max_temp': 0,
            'min_temp': 0,
            'avg_max': 0,
            'avg_min': 0
        }

        # Find Patna in max temp results
        for station, stats in max_results.get('station_stats', {}).items():
            if 'PATNA' in station.upper():
                patna_stats['max_temp'] = stats['maximum']
                patna_stats['avg_max'] = stats['average']
                break

        # Find Patna in min temp results
        for station, stats in min_results.get('station_stats', {}).items():
            if 'PATNA' in station.upper():
                patna_stats['min_temp'] = stats['minimum']
                patna_stats['avg_min'] = stats['average']
                break

        return patna_stats

    def calculate_rainfall_departure(self, current_rainfall, normal_rainfall=10.4):
        """Calculate rainfall departure from normal"""
        if normal_rainfall == 0:
            return 0
        departure = ((current_rainfall - normal_rainfall) / normal_rainfall) * 100
        return round(departure, 1)

    def generate_report_text(self, month, year, lang='hi'):
        """Generate formatted report text in Hindi"""

        max_results = self.analyze_temperature(self.data['daily_max'], 'max')
        min_results = self.analyze_temperature(self.data['daily_min'], 'min')
        rain_results = self.analyze_rainfall(self.data['rainfall'])
        patna_stats = self.get_patna_stats(max_results, min_results)

        # Store results
        self.results = {
            'max_analysis': max_results,
            'min_analysis': min_results,
            'rain_analysis': rain_results,
            'patna': patna_stats
        }

        report = f"""बिहार राज्य का मौसम विश्लेषण: {month} {year} मासिक पूर्वानुमान

प्रदेश में प्रतिस्थापित मौसम विज्ञान केंद्र के विभिन्न वेधशालाओं के प्राप्त आंकड़ों के आधार पर {month} {year} महीने के मौसम का विश्लेषण एवं रिपोर्ट :-

1. सर्वाधिक औसत अधिकतम तापमान
{month} {year} में प्रदेश का सर्वाधिक औसत अधिकतम तापमान {max_results['highest_avg']['value']}°C दर्ज किया गया, जो {max_results['highest_avg']['station']} में रिकॉर्ड हुआ।

2. सर्वाधिक अधिकतम तापमान (एकल दिन)
{max_results['highest_single']['value']}°C का उच्चतम तापमान {month} {year} में {max_results['highest_single']['station']} में दर्ज किया गया, जो महीने का सर्वाधिक रहा।

3. सबसे कम औसत न्यूनतम तापमान
प्रदेश में {month} {year} के दौरान सबसे कम औसत न्यूनतम तापमान {min_results['lowest_avg']['value']}°C, {min_results['lowest_avg']['station']} में रिकॉर्ड किया गया।

4. सबसे कम न्यूनतम तापमान (एकल दिन)
{month} {year} में न्यूनतम तापमान {min_results['lowest_single']['value']}°C दर्ज किया गया, जो {min_results['lowest_single']['station']} में मापा गया।

5. पटना का अधिकतम तापमान
राजधानी पटना में {month} {year} में अधिकतम तापमान {patna_stats['max_temp']}°C दर्ज किया गया।

6. पटना का न्यूनतम तापमान
पटना में {month} {year} में न्यूनतम तापमान {patna_stats['min_temp']}°C रिकॉर्ड किया गया।

7. पटना का औसत तापमान
{month} {year} में पटना का औसत अधिकतम तापमान {patna_stats['avg_max']}°C और औसत न्यूनतम तापमान {patna_stats['avg_min']}°C रहा।

8. मासिक वर्षा की स्थिति
{month} {year} में प्रदेश की कुल मासिक वर्षा {rain_results['total_rainfall']} mm रिकॉर्ड की गई।
सर्वाधिक वर्षा {rain_results['highest_rainfall']['station']} में {rain_results['highest_rainfall']['value']} mm दर्ज की गई।"""

        return report

    def get_five_year_data(self):
        """Extract 5-year comparison data from FTO/PTO sheets"""
        if self.data['five_year'] is None:
            return None

        df = self.data['five_year']

        # Parse the complex structure
        # Rows contain years, columns contain stations
        years = ['2022', '2023', '2024', '2025', '2026']
        stations = ['PATNA', 'GAYA', 'BHAGALPUR', 'PURNEA', 'VALMIKINAGAR']

        result = {
            'mean_max': {},
            'mean_min': {},
            'lowest_min': {},
            'highest_max': {},
            'total_rainfall': {}
        }

        # This is a simplified extraction - actual implementation would parse the specific structure
        for station in stations:
            result['mean_max'][station] = []
            result['mean_min'][station] = []
            result['total_rainfall'][station] = []

        return result

    def export_to_json(self, filepath):
        """Export analysis results to JSON"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, ensure_ascii=False, indent=2)

    def get_chart_data(self):
        """Prepare data for charts"""
        rain_data = self.analyze_rainfall(self.data['rainfall'])

        chart_data = {
            'rainfall_distribution': {
                'labels': [s['station'] for s in rain_data['station_rainfall'][:15]],
                'data': [s['rainfall'] for s in rain_data['station_rainfall'][:15]]
            },
            'statistics': self.results
        }

        return chart_data


def process_weather_report(excel_path, month, year):
    """Main function to process weather report"""
    analyzer = WeatherAnalyzer()

    # Load data
    success, message = analyzer.load_excel_data(excel_path)
    if not success:
        return {'error': message}

    # Generate report
    report_text = analyzer.generate_report_text(month, year)

    # Get chart data
    chart_data = analyzer.get_chart_data()

    return {
        'report': report_text,
        'chart_data': chart_data,
        'statistics': analyzer.results
    }


if __name__ == '__main__':
    # Example usage
    result = process_weather_report(
        'Temperature comparision sheet_MARCH (2022-2026)).xlsx',
        'मार्च',
        '2026'
    )
    print(result['report'])
