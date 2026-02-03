<script lang="ts">
  import { Send, Bold, Italic, Link, AlertTriangle } from 'lucide-svelte';
  import { authUser } from '../stores/auth';

  let message = '';
  let sending = false;
  let stats: any = null;
  let error = '';

  // Simple formatting helpers
  function insertTag(tag: string) {
    const textarea = document.getElementById('broadcast-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = '';
    if (tag === 'b') replacement = `<b>${selected}</b>`;
    else if (tag === 'i') replacement = `<i>${selected}</i>`;
    else if (tag === 'a') replacement = `<a href="YOUR_URL">${selected || 'link text'}</a>`;
    else if (tag === 'code') replacement = `<code>${selected}</code>`;

    message = text.substring(0, start) + replacement + text.substring(end);
    
    // Defer focus restoration
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  }

  async function sendBroadcast() {
    if (!message.trim()) return;
    if (!confirm('Are you sure you want to broadcast this message to ALL users? This cannot be undone.')) return;

    sending = true;
    error = '';
    stats = null;

    try {
        const adminId = $authUser?.id?.toString() || window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
        
        const res = await fetch('/api/admin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message.trim(),
                adminId
            })
        });

        const data = await res.json();
        if (data.ok) {
            stats = data.stats;
            message = ''; // Clear only on success
        } else {
            error = data.error || 'Failed to send broadcast';
        }
    } catch (err: any) {
        error = err.message || 'Network error';
    } finally {
        sending = false;
    }
  }
</script>

<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Broadcast Message</h2>
  
  <div class="mb-2 flex gap-2">
    <button class="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" on:click={() => insertTag('b')} title="Bold">
        <Bold class="h-4 w-4" />
    </button>
    <button class="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" on:click={() => insertTag('i')} title="Italic">
        <Italic class="h-4 w-4" />
    </button>
    <button class="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" on:click={() => insertTag('a')} title="Link">
        <Link class="h-4 w-4" />
    </button>
    <button class="rounded px-2 py-1 text-xs font-mono border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800" on:click={() => insertTag('code')} title="Code">
        &lt;/&gt;
    </button>
  </div>

  <textarea
    id="broadcast-editor"
    bind:value={message}
    class="min-h-[150px] w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    placeholder="Write your message here... (HTML tags supported: <b>bold</b>, <i>italic</i>, <a href='url'>link</a>)"
  ></textarea>

  <div class="mt-4 flex items-center justify-between">
    <div class="text-xs text-gray-500">
        HTML formatting supported
    </div>
    <button
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        on:click={sendBroadcast}
        disabled={!message.trim() || sending}
    >
        {#if sending}
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Sending...
        {:else}
            <Send class="h-4 w-4" />
            Send Broadcast
        {/if}
    </button>
  </div>

  {#if error}
    <div class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <div class="flex items-center gap-2">
            <AlertTriangle class="h-4 w-4" />
            <span>{error}</span>
        </div>
    </div>
  {/if}

  {#if stats}
    <div class="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
        <div class="font-semibold mb-1">Broadcast Complete!</div>
        <div class="grid grid-cols-3 gap-2 text-center">
            <div class="rounded bg-white/50 p-1 dark:bg-black/20">
                <div class="text-xs opacity-70">Total</div>
                <div class="font-bold">{stats.total}</div>
            </div>
            <div class="rounded bg-green-200/50 p-1 dark:bg-green-800/20">
                <div class="text-xs opacity-70">Sent</div>
                <div class="font-bold">{stats.success}</div>
            </div>
            <div class="rounded bg-red-200/50 p-1 dark:bg-red-800/20">
                <div class="text-xs opacity-70">Failed</div>
                <div class="font-bold">{stats.failed}</div>
            </div>
        </div>
    </div>
  {/if}
</div>
