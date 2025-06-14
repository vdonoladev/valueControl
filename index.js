function formatarMoeda(input) {
  let valor = input.value;

  // Remove tudo que não é número
  valor = valor.replace(/[^\d]/g, '');

  // Se não tem nada, limpa o campo
  if (valor === '') {
    input.value = '';
    return;
  }

  // Converte para número e divide por 100 para ter centavos
  valor = parseInt(valor) / 100;

  // Formata com separadores brasileiros
  input.value = valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function converterParaNumero(valorFormatado) {
  if (!valorFormatado || valorFormatado === '') return 0;

  // Remove pontos (separadores de milhares) e substitui vírgula por ponto
  let numero = valorFormatado.replace(/\./g, '').replace(',', '.');
  return parseFloat(numero) || 0;
}

function calcularTotal() {
  const inputs = document.querySelectorAll('input[type="text"]');
  let total = 0;

  inputs.forEach(input => {
    const valor = converterParaNumero(input.value);
    total += valor;
  });

  document.getElementById('totalGeral').textContent = total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function limparTodos() {
  const confirmacao = confirm('Tem certeza que deseja limpar todos os valores?');
  if (confirmacao) {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      input.value = '';
    });
    calcularTotal();
    const resumoDiv = document.getElementById('resumo');
    if (resumoDiv) {
      resumoDiv.style.display = 'none';
    }
    alert('Todos os valores foram limpos!');
  }
}

function exportarCSV() {
  try {
    const rotas = [
      'Zona Sul (Mercado)', 'Pix', 'Zona Sul', 'Metropolitana', 'Serrana',
      'Zona Oeste', 'Médio Paraíba', 'Norte Fluminense', 'Região dos Lagos',
      'Baixada', 'Minas Gerais', 'Costa Verde', 'Centro Sul'
    ];

    const inputs = document.querySelectorAll('input[type="text"]');
    let csvContent = 'Rota;Valor\n';
    let total = 0;

    rotas.forEach((rota, index) => {
      const valor = converterParaNumero(inputs[index].value);
      total += valor;

      // Formatar o valor no padrão brasileiro para o CSV
      const valorFormatado = valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      csvContent += rota + ';' + valorFormatado + '\n';
    });

    // Formatar o total no padrão brasileiro
    const totalFormatado = total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    csvContent += 'TOTAL GERAL;' + totalFormatado;

    // Adicionar BOM para UTF-8
    const bom = '\uFEFF';
    const csvContentWithBom = bom + csvContent;

    const blob = new Blob([csvContentWithBom], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'controle_rotas_' + new Date().toISOString().slice(0, 10) + '.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Arquivo CSV exportado com sucesso!');
    } else {
      // Fallback para navegadores mais antigos
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContentWithBom);
      window.open(dataUri);
    }
  } catch (error) {
    alert('Erro ao exportar CSV. Tente novamente.');
    console.error('Erro na exportação:', error);
  }
}

function gerarResumo() {
  const rotas = [
    'Zona Sul (Mercado)', 'Pix', 'Zona Sul', 'Metropolitana', 'Serrana',
    'Zona Oeste', 'Médio Paraíba', 'Norte Fluminense', 'Região dos Lagos',
    'Baixada', 'Minas Gerais', 'Costa Verde', 'Centro Sul'
  ];

  const inputs = document.querySelectorAll('input[type="text"]');
  let dados = [];
  let total = 0;

  rotas.forEach((rota, index) => {
    const valor = converterParaNumero(inputs[index].value);
    if (valor > 0) {
      dados.push({ rota, valor });
      total += valor;
    }
  });

  dados.sort((a, b) => b.valor - a.valor);

  let resumoHTML = '<h4>Rotas com valores cadastrados:</h4><ul>';
  dados.forEach(item => {
    const porcentagem = ((item.valor / total) * 100).toFixed(1);
    resumoHTML += `<li><strong>${item.rota}:</strong> R$ ${item.valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} (${porcentagem}%)</li>`;
  });
  resumoHTML += '</ul>';
  resumoHTML += `<p><strong>Total: R$ ${total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}</strong></p>`;
  resumoHTML += `<p><strong>Quantidade de rotas ativas:</strong> ${dados.length} de ${rotas.length}</p>`;

  document.getElementById('resumoContent').innerHTML = resumoHTML;
  document.getElementById('resumo').style.display = 'block';
}

// Inicializar o cálculo
calcularTotal();