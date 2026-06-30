document.addEventListener('DOMContentLoaded', () => {
    const txtPrompt = document.getElementById('prompt');
    const btnSend = document.getElementById('btnSend');
    const divResponse = document.getElementById('response');

    btnSend.addEventListener('click', async () => {
        const text = txtPrompt.value.trim();
        if(!text) return;

        btnSend.disabled = true;
        divResponse.textContent = 'Pensando...';

        try{
            const res = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'qwen3.5:2b',
                    prompt: text,
                    stream: false
                })
            })

            if(!res.ok) throw new Error('Error HTTP');

            const data = await res.json();
            divResponse.textContent = data.response ?? '(Sin respuesta)';
            txtPrompt.value = '';
        } catch (error) {
            console.error(error);
            divResponse.textContent = 'Error al conectar con Ollama.';
        } finally {
            btnSend.disabled = false;
        }        
    })
})