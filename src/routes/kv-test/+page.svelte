<script lang="ts">
	import { onMount } from 'svelte';

	let key = 'test-model';
	let value: any = {
		name: 'GGUN 模型',
		fileSize: '15.2MB',
		author: 'XiangPingJun',
		uploadDate: '2024-09-14',
		viewCount: 42,
		tags: ['weapon', '3d', 'unroll-effect'],
		description: '高質量的槍械 3D 模型，支援 Unroll 特效'
	};
	let result = '';
	let isLoading = false;

	// 儲存到 KV
	async function storeValue() {
		isLoading = true;
		try {
			const response = await fetch('/api/kv', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, value })
			});
			
			const data = await response.json();
			result = JSON.stringify(data, null, 2);
		} catch (error) {
			result = `錯誤: ${error}`;
		}
		isLoading = false;
	}

	// 從 KV 讀取
	async function getValue() {
		isLoading = true;
		try {
			const response = await fetch(`/api/kv?key=${encodeURIComponent(key)}`);
			const data = await response.json();
			result = JSON.stringify(data, null, 2);
		} catch (error) {
			result = `錯誤: ${error}`;
		}
		isLoading = false;
	}

	// 從 KV 刪除
	async function deleteValue() {
		isLoading = true;
		try {
			const response = await fetch(`/api/kv?key=${encodeURIComponent(key)}`, {
				method: 'DELETE'
			});
			const data = await response.json();
			result = JSON.stringify(data, null, 2);
		} catch (error) {
			result = `錯誤: ${error}`;
		}
		isLoading = false;
	}

	// 預設範例
	const examples = [
		{
			name: '模型元數據',
			key: 'model:ggun',
			value: {
				name: 'GGUN 模型',
				fileSize: '15.2MB',
				author: 'XiangPingJun',
				uploadDate: '2024-09-14',
				viewCount: 42,
				tags: ['weapon', '3d', 'unroll-effect']
			}
		},
		{
			name: '網站設定',
			key: 'site:config',
			value: {
				title: 'Toy Shelf - 3D 展示',
				theme: 'dark',
				language: 'zh-tw',
				defaultEffect: 'Unroll'
			}
		},
		{
			name: '用戶偏好',
			key: 'user:preferences',
			value: {
				autoRotate: false,
				quality: 'high',
				showFPS: true,
				volume: 0.8
			}
		}
	];

	function loadExample(example: typeof examples[0]) {
		key = example.key;
		value = example.value;
	}
</script>

<div class="container">
	<h1>🔑 Cloudflare KV 測試頁面</h1>
	
	<div class="examples">
		<h2>📋 範例數據</h2>
		<div class="example-buttons">
			{#each examples as example}
				<button 
					class="example-btn"
					on:click={() => loadExample(example)}
				>
					{example.name}
				</button>
			{/each}
		</div>
	</div>

	<div class="form-section">
		<h2>💾 KV 操作</h2>
		
		<div class="input-group">
			<label for="key">Key (鍵):</label>
			<input 
				id="key"
				type="text" 
				bind:value={key} 
				placeholder="例: model:ggun"
			>
		</div>

		<div class="input-group">
			<label for="value">Value (值, JSON 格式):</label>
			<textarea 
				id="value"
				bind:value={value}
				rows="8"
				placeholder="例: JSON 物件格式"
			></textarea>
		</div>

		<div class="buttons">
			<button 
				on:click={storeValue}
				disabled={isLoading}
				class="btn store"
			>
				{isLoading ? '儲存中...' : '💾 儲存到 KV'}
			</button>
			
			<button 
				on:click={getValue}
				disabled={isLoading}
				class="btn get"
			>
				{isLoading ? '讀取中...' : '📖 從 KV 讀取'}
			</button>
			
			<button 
				on:click={deleteValue}
				disabled={isLoading}
				class="btn delete"
			>
				{isLoading ? '刪除中...' : '🗑️ 從 KV 刪除'}
			</button>
		</div>
	</div>

	{#if result}
		<div class="result-section">
			<h2>📤 結果</h2>
			<pre class="result">{result}</pre>
		</div>
	{/if}

	<div class="info">
		<h2>ℹ️ 使用說明</h2>
		<ul>
			<li>🔄 <strong>儲存</strong>: 將數據存入 Cloudflare KV</li>
			<li>📖 <strong>讀取</strong>: 從 KV 獲取數據</li>
			<li>🗑️ <strong>刪除</strong>: 從 KV 移除數據</li>
			<li>⚡ <strong>全球同步</strong>: 數據會自動同步到全球邊緣節點</li>
			<li>⏰ <strong>延遲提醒</strong>: 寫入可能需要最多60秒全球同步</li>
		</ul>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	h1, h2 {
		color: #333;
		margin-bottom: 1rem;
	}

	.examples {
		background: #f8f9fa;
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.example-buttons {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.example-btn {
		background: #007acc;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		transition: background 0.2s;
	}

	.example-btn:hover {
		background: #005a9e;
	}

	.form-section {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.input-group {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
		color: #555;
	}

	input, textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 14px;
	}

	textarea {
		resize: vertical;
	}

	.buttons {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.btn {
		padding: 12px 20px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		transition: transform 0.1s, box-shadow 0.2s;
	}

	.btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0,0,0,0.1);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn.store {
		background: #28a745;
		color: white;
	}

	.btn.get {
		background: #17a2b8;
		color: white;
	}

	.btn.delete {
		background: #dc3545;
		color: white;
	}

	.result-section {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.result {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 15px;
		border-radius: 4px;
		overflow-x: auto;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.4;
	}

	.info {
		background: #e3f2fd;
		border-left: 4px solid #2196f3;
		padding: 20px;
		border-radius: 0 8px 8px 0;
	}

	.info ul {
		margin: 0;
		padding-left: 20px;
	}

	.info li {
		margin-bottom: 8px;
		line-height: 1.5;
	}

	@media (max-width: 600px) {
		.container {
			padding: 10px;
		}
		
		.buttons {
			flex-direction: column;
		}
		
		.example-buttons {
			flex-direction: column;
		}
	}
</style>