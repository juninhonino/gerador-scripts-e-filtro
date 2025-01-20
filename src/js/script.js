// Gerador de Regras de Bloqueio de IP
document.getElementById('generateButtonIP').addEventListener('click', async () => {
    const ipsFileInput = document.getElementById('ipsFile');
    const descriptionInput = document.getElementById('description');

    if (!ipsFileInput.files.length) {
        alert('Por favor, selecione um arquivo de IPs.');
        return;
    }

    const ipsFile = ipsFileInput.files[0];
    const description = descriptionInput.value.trim();

    if (!description) {
        alert('Por favor, insira uma descrição para a regra.');
        return;
    }

    try {
        // Ler o arquivo de IPs
        const ipsText = await ipsFile.text();
        const ipsLines = ipsText.split(/\r?\n/).map(line => line.trim()).filter(line => line);

        // Gerar o conteúdo formatado com a descrição fornecida
        const formattedLines = ipsLines.map(ip => 
            `ip route-static ${ip} 255.255.255.255 NULL0 preference 1 description ${description}`
        );

        // Criar o arquivo de saída
        const outputBlob = new Blob([formattedLines.join('\n')], { type: 'text/plain' });
        const outputUrl = URL.createObjectURL(outputBlob);

        // Forçar o download
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = 'regras_ip.txt';
        link.click();

        // Limpar o objeto URL
        URL.revokeObjectURL(outputUrl);
    } catch (error) {
        console.error('Erro ao processar os IPs:', error);
        alert('Ocorreu um erro ao processar o arquivo de IPs. Verifique o console para mais detalhes.');
    }
});


// Filtro de Arquivos DNS
document.getElementById('filterButton').addEventListener('click', async () => {
    const baseFileInput = document.getElementById('baseFile');
    const novoFileInput = document.getElementById('novoFile');

    if (!baseFileInput.files.length || !novoFileInput.files.length) {
        alert('Por favor, selecione ambos os arquivos.');
        return;
    }

    const baseFile = baseFileInput.files[0];
    const novoFile = novoFileInput.files[0];

    try {
        // Ler os arquivos
        const baseText = await baseFile.text();
        const novoText = await novoFile.text();

        // Processar os arquivos
        const baseLines = new Set(baseText.split(/\r?\n/).map(line => line.trim())); // Trimar espaços
        const novoLines = novoText.split(/\r?\n/);

        // Filtrar e manter as linhas do novo arquivo que não estão no base
        const filteredLines = novoLines.filter(line => line.trim() && !baseLines.has(line.trim()));

        // Criar o arquivo de saída com as linhas filtradas
        const outputBlob = new Blob([filteredLines.join('\n')], { type: 'text/plain' });
        const outputUrl = URL.createObjectURL(outputBlob);

        // Forçar o download do arquivo filtrado
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = 'saida.txt';
        link.click();

        // Limpar o objeto URL
        URL.revokeObjectURL(outputUrl);
    } catch (error) {
        console.error('Erro ao processar os arquivos:', error);
        alert('Ocorreu um erro ao processar os arquivos. Verifique o console para mais detalhes.');
    }
});


// Gerador de Regras DNS
document.getElementById('generateButtonDNS').addEventListener('click', async () => {
    const sitesFileInput = document.getElementById('sitesFile');

    if (!sitesFileInput.files.length) {
        alert('Por favor, selecione um arquivo de sites.');
        return;
    }

    const sitesFile = sitesFileInput.files[0];

    try {
        // Ler o arquivo de sites
        const sitesText = await sitesFile.text();
        const sitesLines = sitesText.split(/\r?\n/).map(line => line.trim()).filter(line => line);

        // Gerar o conteúdo formatado
        const formattedLines = sitesLines.flatMap(site => [
            `local-zone: "${site}" redirect`,
            `local-data: "${site} A 127.0.0.1"`,
            `local-data: "${site} AAAA ::1"`
        ]);

        // Criar o arquivo de saída
        const outputBlob = new Blob([formattedLines.join('\n')], { type: 'text/plain' });
        const outputUrl = URL.createObjectURL(outputBlob);

        // Forçar o download
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = 'oficio.txt';
        link.click();

        // Limpar o objeto URL
        URL.revokeObjectURL(outputUrl);
    } catch (error) {
        console.error('Erro ao processar os sites:', error);
        alert('Ocorreu um erro ao processar o arquivo de sites. Verifique o console para mais detalhes.');
    }
});
