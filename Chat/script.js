document.addEventListener('DOMContentLoaded', () => {
    const txtPrompt = document.getElementById('prompt');
    const btnSend = document.getElementById('btnSend');
    const divResponse = document.getElementById('response');

    btnSend.addEventListener('click', async () => {
        const text = txtPrompt.value.trim();
        if(!text) return;

        btnSend.disabled = true;
        divResponse.textContent = 'Pensando...';

        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3.5:2b',
                prompt: text,
                stream: false
            })
        })

        const data = await res.json();

        divResponse.textContent = data.response ?? '(Sin respuesta)';
        btnSend.disabled = false;
        txtPrompt.value = '';
    })
})