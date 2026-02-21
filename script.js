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
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbyL2O9AT6WM1dPJS62Gst5i24ufICednYQb_rwBHJJP5uxf1V_cFCeCThFI-T7HG4gB/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error("Erro HTTP: " + resposta.status);
    }

    const resultado = await resposta.json();

    if (resultado.status === "ocupado") {
      mensagem.innerHTML = "<p class='erro'>❌ Esse horário já está ocupado. Escolha outro.</p>";
      return;
    }

    if (resultado.status === "confirmado") {

      mensagem.innerHTML = "<p class='sucesso'>✅ Agendamento confirmado! Redirecionando para WhatsApp...</p>";

      const numero = "5512999999999"; // coloque o número real

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

      return;
    }

    mensagem.innerHTML = "<p class='erro'>Erro inesperado. Tente novamente.</p>";

  } catch (erro) {
    console.error("Erro:", erro);
    mensagem.innerHTML = "<p class='erro'>Erro ao conectar com o servidor.</p>";
  }
});

