document.addEventListener('DOMContentLoaded', () => {
    const txtPrompt = document.getElementById('prompt');
    const btnSend = document.getElementById('btnSend');
    const divChat = document.getElementById('chat');

    const messages = [];

    btnSend.addEventListener('click', async () => {
        const text = txtPrompt.value.trim();
        if(!text) return;

        messages.push({ 
            role: 'user',
            content: text 
        });

        txtPrompt.value = '';
        btnSend.disabled = true;

        try{
            const res = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'qwen3.5:2b',
                    messages: messages,
                    stream: false
                })
            })

            if(!res.ok) throw new Error('Error HTTP');

            const data = await res.json();
            const reply = data.message?.content ?? '(Sin respuesta)';
            messages.push({ 
                role: 'assistant',
                content: reply
            });
            console.log(messages);
        } catch (error) {
            console.error(error);
            messages.push({ 
                role: 'assistant',
                content: 'Error al conectar con Ollama.' 
            });
        } finally {
            btnSend.disabled = false;
        }        
    })
})