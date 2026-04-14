

const scriptsInEvents = {

	async Folhadeeventosfases_Event34_Act1(runtime, localVars)
	{
		// Pega a instância do texto
		const mensagem = runtime.objects.TextoderroteSeusInimigos.getFirstInstance();
		
		if (mensagem) {
		    // 1. Torna o objeto visível
		    mensagem.isVisible = true;
		    
		    // 2. Garante que o texto seja o correto
		    mensagem.text = "derrote seus inimigos";
		    
		    // 3. Aguarda 3 segundos e esconde novamente
		    setTimeout(() => {
		        mensagem.isVisible = false;
		    }, 3000);
		}
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
