const form = document.getElementById("form-agendamento");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  mensagem.innerHTML = "Verificando disponibilidade...";

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  if (!data || !hora) {
    mensagem.innerHTML = "<p class='erro'>Selecione data e horário.</p>";
    return;
  }

  const inicio = new Date(`${data}T${hora}`);
  const fim = new Date(inicio.getTime() + 60 * 60000);

  const dados = {
    nome: nome,
    telefone: telefone,
    servico: servico,
    start: inicio.toISOString(),
    end: fim.toISOString()
  };

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbzR6kjKh5OA9UVI12GS-4UBKpcfSaBf664ZWP_lwKXkHngAIKMZsI3XXl6C2JY1dhmg/exec", {
      method: "POST",
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resultado.status === "ocupado") {
      mensagem.innerHTML = "<p class='erro'>❌ Esse horário já está ocupado. Escolha outro.</p>";
    } else {

      mensagem.innerHTML = "<p class='sucesso'>✅ Agendamento confirmado! Redirecionando para WhatsApp...</p>";

      const numero = "5512999999999"; // ⚠️ TROQUE PELO NÚMERO REAL DA ANA

      const texto = `Olá Ana! Meu agendamento foi confirmado:

Nome: ${nome}
Serviço: ${servico}
Data: ${data}
Horário: ${hora}

Obrigada!`;

      const urlWhats = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

      setTimeout(() => {
        window.open(urlWhats, "_blank");
        form.reset();
      }, 1500);
    }

  } catch (erro) {
    mensagem.innerHTML = "<p class='erro'>Erro ao conectar com o servidor.</p>";
  }
});