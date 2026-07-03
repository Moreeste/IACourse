document.addEventListener('DOMContentLoaded', () => {
    const txtPrompt = document.getElementById('prompt');
    const btnSend = document.getElementById('btnSend');
    const divChat = document.getElementById('chat');

    const messages = [];

    function showChat(){
        divChat.innerHTML = '';
        messages.forEach(({ role, content}) => {
            const bubbleDiv = document.createElement('div');
            bubbleDiv.classList.add('bubble', role === 'user' ? 'bubble-user' : 'bubble-assistant');
            bubbleDiv.textContent = content;
            divChat.appendChild(bubbleDiv);
        });

        divChat.scrollTop = divChat.scrollHeight;
    }

    btnSend.addEventListener('click', async () => {
        const text = txtPrompt.value.trim();
        if(!text) return;

        messages.push({ 
            role: 'user',
            content: text 
        });

        txtPrompt.value = '';
        showChat();
        btnSend.disabled = true;

        const thinking = document.createElement('div');
        thinking.classList.add('bubble', 'bubble-thinking');
        thinking.textContent = 'Pensando...';
        divChat.appendChild(thinking);
        divChat.scrollTop = divChat.scrollHeight;

        try{
            const res = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma4:e2b',
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
            thinking.remove();
            showChat();
            btnSend.disabled = false;
        }        
    })
})