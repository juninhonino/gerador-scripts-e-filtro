// Função genérica para baixar arquivos
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Filtro de Arquivos Unbound
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
        const baseText = await baseFile.text();
        const novoText = await novoFile.text();

        const baseLines = new Set(baseText.split(/\r?\n/).map(line => line.trim()));
        const novoLines = novoText.split(/\r?\n/);

        const filteredLines = novoLines.filter(line => line.trim() && !baseLines.has(line.trim()));
        const uniqueFilteredLines = [...new Set(filteredLines)];

        const outputBlob = new Blob([uniqueFilteredLines.join('\n')], { type: 'text/plain' });
        const outputUrl = URL.createObjectURL(outputBlob);

        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = 'saida.txt';
        link.click();

        URL.revokeObjectURL(outputUrl);
    } catch (error) {
        console.error('Erro ao processar os arquivos:', error);
        alert('Ocorreu um erro ao processar os arquivos. Verifique o console para mais detalhes.');
    }
});

// Gerador de Regras DNS
document.getElementById('generateButtonDNS').addEventListener('click', async () => {
    const fileInput = document.getElementById('sitesFile');
    const textInput = document.getElementById('dnsInput').value;
    const fileName = document.getElementById('dnsFileName').value || 'oficio_dns.txt';

    let lines = [];

    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const text = await file.text();
        lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    } else if (textInput) {
        lines = textInput.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    }

    if (!lines.length) {
        alert('Por favor, insira ou carregue endereços.');
        return;
    }

    const formatted = lines.flatMap(site => [
        `local-zone: "${site}" redirect`,
        `local-data: "${site} A 127.0.0.1"`,
        `local-data: "${site} AAAA ::1"`
    ]);

    document.getElementById('dnsResult').textContent = formatted.join('\n');
    if (fileInput.files.length) downloadFile(formatted.join('\n'), fileName);
});

// Gerador de Regras IP
document.getElementById('generateButtonIP').addEventListener('click', async () => {
    const fileInput = document.getElementById('ipsFile');
    const textInput = document.getElementById('ipInput').value;
    const description = document.getElementById('description').value;
    const fileName = document.getElementById('ipFileName').value || 'regras_ip.txt';

    if (!description) {
        alert('Por favor, insira uma descrição.');
        return;
    }

    let lines = [];

    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const text = await file.text();
        lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    } else if (textInput) {
        lines = textInput.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    }

    if (!lines.length) {
        alert('Por favor, insira ou carregue IPs.');
        return;
    }

    const formatted = lines.map(ip => 
        `ip route-static ${ip} 255.255.255.255 NULL0 preference 1 description ${description}`
    );

    document.getElementById('ipResult').textContent = formatted.join('\n');
    if (fileInput.files.length) downloadFile(formatted.join('\n'), fileName);
});
