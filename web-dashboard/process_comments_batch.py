#!/usr/bin/env python3
"""
Yorum dosyalarını batch'ler halinde işle - RAM dostu
"""

import pandas as pd
import json
import os
import glob
import gc

# Veri seti konumu
DATA_PATH = '/root/.cache/kagglehub/datasets/bwandowando/reddit-rnews-subreddit-2008-to-2024/versions/2'
OUTPUT_PATH = '/root/AIshit/web-dashboard/data'

def process_comment_batch(comment_files, batch_name):
    """Bir batch yorum dosyasını işle"""
    print(f"\n{'='*60}")
    print(f"Processing {batch_name}")
    print(f"{'='*60}")
    
    comment_counts = {}
    
    for i, file in enumerate(comment_files, 1):
        print(f"  [{i}/{len(comment_files)}] {os.path.basename(file)}")
        try:
            # Sadece link sütununu oku
            df_comments = pd.read_parquet(file, columns=['link'])
            
            # Submission ID'yi çıkar
            df_comments['submission_id'] = df_comments['link'].str.extract(r'/comments/([a-z0-9]+)/', expand=False)
            
            # Yorum say
            counts = df_comments['submission_id'].value_counts().to_dict()
            
            # Birleştir
            for sub_id, count in counts.items():
                if pd.notna(sub_id):
                    comment_counts[sub_id] = comment_counts.get(sub_id, 0) + count
            
            # Memory temizle
            del df_comments
            gc.collect()
                
        except Exception as e:
            print(f"    ✗ Error: {e}")
            continue
    
    print(f"\n✓ {batch_name} complete: {len(comment_counts):,} submissions with comments")
    return comment_counts

def save_batch_results(comment_counts, batch_name):
    """Batch sonuçlarını kaydet"""
    output_file = os.path.join(OUTPUT_PATH, f'comments_{batch_name}.json')
    with open(output_file, 'w') as f:
        json.dump(comment_counts, f)
    print(f"✓ Saved to: {output_file}")

def load_batch_results(batch_name):
    """Batch sonuçlarını yükle"""
    input_file = os.path.join(OUTPUT_PATH, f'comments_{batch_name}.json')
    if os.path.exists(input_file):
        with open(input_file, 'r') as f:
            return json.load(f)
    return {}

def main():
    """Ana fonksiyon"""
    print("="*60)
    print("Reddit r/news Comment Processor (Batch Mode)")
    print("="*60)
    
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    
    # Tüm comment dosyalarını bul
    comment_files = sorted(glob.glob(os.path.join(DATA_PATH, 'news_comments_*.parquet')))
    print(f"\nFound {len(comment_files)} comment files")
    
    # İki batch'e böl
    mid = len(comment_files) // 2
    batch1_files = comment_files[:mid]
    batch2_files = comment_files[mid:]
    
    print(f"Batch 1: {len(batch1_files)} files")
    print(f"Batch 2: {len(batch2_files)} files")
    
    # Batch 1'i işle
    print("\n" + "="*60)
    print("STEP 1/3: Processing Batch 1")
    print("="*60)
    batch1_counts = process_comment_batch(batch1_files, "batch1")
    save_batch_results(batch1_counts, "batch1")
    
    # Memory temizle
    del batch1_counts
    gc.collect()
    
    # Batch 2'yi işle
    print("\n" + "="*60)
    print("STEP 2/3: Processing Batch 2")
    print("="*60)
    batch2_counts = process_comment_batch(batch2_files, "batch2")
    save_batch_results(batch2_counts, "batch2")
    
    # Batch'leri birleştir
    print("\n" + "="*60)
    print("STEP 3/3: Merging Results")
    print("="*60)
    
    print("Loading batch 1...")
    all_counts = load_batch_results("batch1")
    
    print("Loading batch 2...")
    batch2 = load_batch_results("batch2")
    
    print("Merging...")
    for sub_id, count in batch2.items():
        all_counts[sub_id] = all_counts.get(sub_id, 0) + count
    
    # Final sonucu kaydet
    final_file = os.path.join(OUTPUT_PATH, 'all_comment_counts.json')
    with open(final_file, 'w') as f:
        json.dump(all_counts, f)
    
    print(f"\n✓ All batches merged!")
    print(f"📁 Output: {final_file}")
    print(f"📊 Total submissions with comments: {len(all_counts):,}")
    print(f"💬 Total comments: {sum(all_counts.values()):,}")
    print("="*60)

if __name__ == '__main__':
    main()
