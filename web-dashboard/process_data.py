#!/usr/bin/env python3
"""
Submissions + Comment counts birleştirme (önceden işlenmiş yorum verileri ile)
"""

import pandas as pd
import json
import os
from collections import Counter

# Veri seti konumu
DATA_PATH = '/root/.cache/kagglehub/datasets/bwandowando/reddit-rnews-subreddit-2008-to-2024/versions/2'
OUTPUT_PATH = '/root/AIshit/web-dashboard/data'

def load_comment_counts():
    """Önceden işlenmiş yorum sayılarını yükle"""
    print("Loading pre-processed comment counts...")
    comment_file = os.path.join(OUTPUT_PATH, 'all_comment_counts.json')
    
    if not os.path.exists(comment_file):
        print("  ✗ Comment counts not found. Run process_comments_batch.py first!")
        return {}
    
    with open(comment_file, 'r') as f:
        counts = json.load(f)
    
    print(f"  ✓ Loaded {len(counts):,} submissions with comment data")
    return counts

def load_submissions():
    """Submissions parquet dosyasını yükle"""
    print("Loading submissions...")
    submissions_file = os.path.join(DATA_PATH, 'news_submissions.parquet')
    
    if not os.path.exists(submissions_file):
        raise FileNotFoundError(f"File not found: {submissions_file}")
    
    df = pd.read_parquet(submissions_file)
    print(f"  ✓ Loaded {len(df):,} submissions")
    return df

def process_yearly_stats(df):
    """Yıllık istatistikleri hesapla"""
    print("Processing yearly stats...")
    
    df['date'] = pd.to_datetime(df['created'])
    df['year'] = df['date'].dt.year
    
    yearly = df.groupby('year').agg({
        'title': 'count',
        'score': 'mean',
        'num_comments': 'mean'
    }).reset_index()
    
    yearly.columns = ['year', 'count', 'avg_score', 'avg_comments']
    
    result = {
        'years': yearly['year'].tolist(),
        'postCounts': yearly['count'].tolist(),
        'avgScores': [round(x, 2) for x in yearly['avg_score'].tolist()],
        'avgComments': [round(x, 2) for x in yearly['avg_comments'].tolist()]
    }
    
    return result

def process_major_events(df):
    """Büyük olaylar analizi"""
    print("Processing major events...")
    
    df['date'] = pd.to_datetime(df['created'])
    df['year'] = df['date'].dt.year
    
    events = [
        {
            'name': '2008 Financial Crisis',
            'period': '2008-2009',
            'startYear': 2008,
            'endYear': 2009,
            'keywords': ['economy', 'financial', 'crisis', 'bailout', 'recession', 'bank', 'wall street']
        },
        {
            'name': '2011 Arab Spring',
            'period': '2011-2012',
            'startYear': 2011,
            'endYear': 2012,
            'keywords': ['egypt', 'libya', 'syria', 'tunisia', 'protest', 'revolution', 'arab']
        },
        {
            'name': '2016 US Elections',
            'period': '2016',
            'startYear': 2016,
            'endYear': 2016,
            'keywords': ['trump', 'clinton', 'election', 'vote', 'campaign', 'presidential']
        },
        {
            'name': '2020 COVID-19 Pandemic',
            'period': '2020-2021',
            'startYear': 2020,
            'endYear': 2021,
            'keywords': ['covid', 'coronavirus', 'pandemic', 'vaccine', 'lockdown', 'virus', 'quarantine']
        },
        {
            'name': '2022-2023 Ukraine War',
            'period': '2022-2023',
            'startYear': 2022,
            'endYear': 2023,
            'keywords': ['ukraine', 'russia', 'putin', 'war', 'invasion', 'nato', 'zelensky']
        }
    ]
    
    results = []
    
    for event in events:
        event_df = df[(df['year'] >= event['startYear']) & (df['year'] <= event['endYear'])]
        mask = event_df['title'].str.lower().str.contains('|'.join(event['keywords']), na=False)
        relevant_df = event_df[mask]
        
        stats = {
            'totalPosts': len(relevant_df),
            'avgScore': round(relevant_df['score'].mean(), 2) if len(relevant_df) > 0 else 0,
            'avgComments': round(relevant_df['num_comments'].mean(), 2) if len(relevant_df) > 0 else 0,
            'percentageOfPeriod': round(len(relevant_df) / len(event_df) * 100, 2) if len(event_df) > 0 else 0
        }
        
        results.append({
            'name': event['name'],
            'period': event['period'],
            'stats': stats,
            'topKeywords': event['keywords'][:5]
        })
    
    return results

def process_summary(df):
    """Genel özet istatistikleri"""
    print("Processing summary...")
    
    df['date'] = pd.to_datetime(df['created'])
    
    top_posts = df.nlargest(10, 'score')[['title', 'score', 'num_comments', 'created']].copy()
    top_posts['date'] = pd.to_datetime(top_posts['created']).dt.strftime('%Y-%m-%d')
    
    summary = {
        'totalPosts': len(df),
        'avgScore': str(round(df['score'].mean(), 2)),
        'avgComments': str(round(df['num_comments'].mean(), 2)),
        'dateRange': {
            'start': int(df['date'].min().year),
            'end': int(df['date'].max().year)
        },
        'topPosts': [
            {
                'title': row['title'],
                'score': int(row['score']),
                'comments': int(row['num_comments']),
                'date': row['date']
            }
            for _, row in top_posts.iterrows()
        ]
    }
    
    return summary

def process_top_words(df, limit=50):
    """En popüler kelimeleri bul"""
    print("Processing top words...")
    
    stop_words = set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
        'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
        'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
        'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
        'says', 'after', 'new', 'over', 'more', 'than', 'about', 'just', 'their'
    ])
    
    all_words = []
    for title in df['title'].dropna():
        words = str(title).lower().split()
        words = [w.strip('.,!?;:()[]{}"\'-') for w in words]
        words = [w for w in words if len(w) > 3 and w not in stop_words and w.isalpha()]
        all_words.extend(words)
    
    word_freq = Counter(all_words).most_common(limit)
    
    return {
        'words': [word for word, _ in word_freq],
        'frequencies': [freq for _, freq in word_freq]
    }

def main():
    """Ana fonksiyon"""
    print("="*60)
    print("Reddit r/news Final Data Processor")
    print("="*60)
    
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    
    # Yorum sayılarını yükle
    comment_counts = load_comment_counts()
    
    # Submissions yükle
    df = load_submissions()
    
    # Submission ID'leri çıkar
    print("Extracting submission IDs...")
    df['submission_id'] = df['link'].str.extract(r'/comments/([a-z0-9]+)/', expand=False)
    
    # Yorum sayılarını ekle
    print("Merging comment counts...")
    df['num_comments'] = df['submission_id'].map(comment_counts).fillna(0).astype(int)
    
    print(f"\n✓ Comment counts merged!")
    print(f"  Average comments per post: {df['num_comments'].mean():.2f}")
    print(f"  Max comments: {df['num_comments'].max():,}")
    print(f"  Posts with comments: {(df['num_comments'] > 0).sum():,}")
    
    # İşle ve kaydet
    print("\nProcessing analytics...")
    data = {
        'yearlyStats': process_yearly_stats(df),
        'majorEvents': process_major_events(df),
        'summary': process_summary(df),
        'topWords': process_top_words(df, 50)
    }
    
    # JSON'a kaydet
    output_file = os.path.join(OUTPUT_PATH, 'processed_data.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Data processed successfully!")
    print(f"📁 Output: {output_file}")
    print(f"📊 Total posts: {data['summary']['totalPosts']:,}")
    print(f"💬 Avg comments: {data['summary']['avgComments']}")
    print(f"⭐ Avg score: {data['summary']['avgScore']}")
    print(f"📅 Date range: {data['summary']['dateRange']['start']}-{data['summary']['dateRange']['end']}")
    print("="*60)
    print("\n✓ Ready! Restart the server to see updated data.")
    print("  cd /root/AIshit/web-dashboard && npm start")
    print("="*60)

if __name__ == '__main__':
    main()
