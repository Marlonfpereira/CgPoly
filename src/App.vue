<!-- Trabalho 1 CG feito por Marlon Fabichacki Pereira -->
<template>
  <v-app>
    <v-main class="main">

      <div class="wrapper">
        <canvas class="quadro" ref="canvas" height="760" width="1180"></canvas>
      </div>

      <div class="controle">
        <div>

          <p class="dialog">{{ dialogo }}</p>

          <v-color-picker :disabled="CorDesativada" v-model="corAtual" elevation="0" mode="rgb"></v-color-picker>

          <div class="listaLegenda">
            <p>Nome</p>
            <div class="itensLegenda">
              <p>Aresta</p>
              <v-divider vertical></v-divider>
              <p>V1</p>
              <v-divider vertical></v-divider>
              <p>V2</p>
              <v-divider vertical></v-divider>
              <p>V3</p>
              <v-divider vertical></v-divider>
              <p>Del</p>
            </div>
          </div>
          <div class="listaPoly">
            <div class="poly" v-for="(poly, index) in listaPoly" :key="index">
              <v-text-field v-model="poly.nome" density="compact" variant="solo" bg-color="#ddd" flat hide-details
                label=""></v-text-field>

              <div class="vOps">
                <v-card class="vCor" :color="poly.corAresta">
                  <v-overlay @click:outside="drawAllPoly" activator="parent" locationStrategy="connected"
                    offset="-300 -290" scroll-strategy="block">
                    <v-color-picker v-model="poly.corAresta" position="fixed" mode="rgb"></v-color-picker>
                  </v-overlay>
                </v-card>
                <v-card class="vCor" :color="poly.pontos[0].cor">
                  <v-overlay @click:outside="drawAllPoly" activator="parent" locationStrategy="connected"
                    offset="-300 -290" scroll-strategy="block">
                    <v-color-picker v-model="poly.pontos[0].cor" position="fixed" mode="rgb"></v-color-picker>
                  </v-overlay>
                </v-card>
                <v-card class="vCor" :color="poly.pontos[1].cor">
                  <v-overlay @click:outside="drawAllPoly" activator="parent" locationStrategy="connected"
                    offset="-300 -290" scroll-strategy="block">
                    <v-color-picker v-model="poly.pontos[1].cor" position="fixed" mode="rgb"></v-color-picker>
                  </v-overlay>
                </v-card>
                <v-card class="vCor" :color="poly.pontos[2].cor">
                  <v-overlay @click:outside="drawAllPoly" activator="parent" locationStrategy="connected"
                    offset="-300 -290" scroll-strategy="block">
                    <v-color-picker v-model="poly.pontos[2].cor" position="fixed" mode="rgb"></v-color-picker>
                  </v-overlay>
                </v-card>
                <v-icon @click="delPoly(index)" class="deleteIcon" icon="mdi-delete"></v-icon>
              </div>
            </div>
          </div>
        </div>

        <div class="botoes">
          <v-btn @click="criarPoligono" :disabled="botoesDesativados" variant="tonal">Criar Polígono</v-btn>
          <v-btn @click="resetaCanvas" :disabled="listaPoly.length == 0" variant="outlined" color="red">Resetar</v-btn>
        </div>
      </div>

    </v-main>
  </v-app>
</template>

<script>
// Trabalho 1 CG feito por Marlon Fabichacki Pereira
import { Poly } from './models/Poly';
import { Ponto } from './models/Ponto';


export default {
  data() {
    return {
      canvas: null,
      CorDesativada: true,
      botoesDesativados: false,
      corAtual: "#000000",
      dialogo: "Selecione uma opção:",
      listaPoly: [],
    };
  },
  methods: {
    criarPoligono() {
      this.botoesDesativados = true
      this.dialogo = "Criando os vértices"
      this.CorDesativada = false

      this.handleMouse()
    },
    handleMouse() {
      let clickCount = 0
      const canvas = this.$refs.canvas
      let newPoly = new Poly()

      const moveListener = (click) => {
        this.dialogo = "V" + clickCount + " = (" + click.offsetX + ", " + click.offsetY + ") " + this.corAtual
      }

      const clickListener = (click) => {
        let x = click.offsetX, y = click.offsetY

        if (clickCount > 0 && x == newPoly.pontos[0].x && y == newPoly.pontos[0].y) {
          this.dialogo = 'Selecione um vértice diferente'
        } else if (clickCount > 1 && x == newPoly.pontos[1].x && y == newPoly.pontos[1].y) {
          this.dialogo = 'Selecione um vértice diferente'
        } else {
          clickCount++

          let ponto = new Ponto(x, y, this.corAtual)
          newPoly.pontos.push(ponto)
        }

        if (clickCount >= 3) {
          canvas.removeEventListener('click', clickListener)
          canvas.removeEventListener('mousemove', moveListener)

          newPoly.nome = "Poly " + this.listaPoly.length
          this.listaPoly.push(newPoly)
          this.fillPoly(newPoly)

          let ctx = this.canvas
          ctx.beginPath()
          ctx.moveTo(newPoly.pontos[0].x, newPoly.pontos[0].y)
          ctx.lineTo(newPoly.pontos[1].x, newPoly.pontos[1].y)
          ctx.lineTo(newPoly.pontos[2].x, newPoly.pontos[2].y)
          ctx.lineTo(newPoly.pontos[0].x, newPoly.pontos[0].y)
          ctx.lineWidth = 3
          ctx.strokeStyle = newPoly.corAresta
          ctx.stroke()

          this.finalizaPoly()
          return
        }
      }

      canvas.addEventListener('click', clickListener)
      canvas.addEventListener('mousemove', moveListener)
    },
    finalizaPoly() {
      this.botoesDesativados = false
      this.CorDesativada = true
      this.dialogo = "Selecione uma opção:"
    },
    resetaCanvas() {
      window.location.reload()
    },
    drawAllPoly() {
      let ctx = this.canvas
      ctx.clearRect(0, 0, 1180, 760)
      this.listaPoly.forEach(poly => {
        this.fillPoly(poly)

        ctx.beginPath()
        ctx.moveTo(poly.pontos[0].x, poly.pontos[0].y)
        ctx.lineTo(poly.pontos[1].x, poly.pontos[1].y)
        ctx.lineTo(poly.pontos[2].x, poly.pontos[2].y)
        ctx.lineTo(poly.pontos[0].x, poly.pontos[0].y)
        ctx.lineWidth = 3
        ctx.strokeStyle = poly.corAresta
        ctx.stroke()
      });
    },
    delPoly(index) {
      this.listaPoly.splice(index, 1)
      this.drawAllPoly()
    },
    drawPixel(x, y, cor = this.corAtual) {
      this.canvas.lineWidth = 1
      this.canvas.strokeStyle = cor

      this.canvas.fillStyle = cor
      this.canvas.fillRect(x, y, 1, 1)
    },
    fillPoly(poly) {
      poly.pontos.sort((a, b) => a.y - b.y)
      let v0 = poly.pontos[0], v1 = poly.pontos[1], v2 = poly.pontos[2]
      const v0Cor = this.hexToRgb(v0.cor)
      const v1Cor = this.hexToRgb(v1.cor)
      const v2Cor = this.hexToRgb(v2.cor)

      const arestas = [
        { ini: v0, fim: v1, taxa: ((v1.x - v0.x) / (v1.y - v0.y)), taxaR: ((v1Cor.r - v0Cor.r) / (v1.y - v0.y)), taxaG: ((v1Cor.g - v0Cor.g) / (v1.y - v0.y)), taxaB: ((v1Cor.b - v0Cor.b) / (v1.y - v0.y)) },
        { ini: v1, fim: v2, taxa: ((v2.x - v1.x) / (v2.y - v1.y)), taxaR: ((v2Cor.r - v1Cor.r) / (v2.y - v1.y)), taxaG: ((v2Cor.g - v1Cor.g) / (v2.y - v1.y)), taxaB: ((v2Cor.b - v1Cor.b) / (v2.y - v1.y)) },
        { ini: v2, fim: v0, taxa: ((v0.x - v2.x) / (v0.y - v2.y)), taxaR: ((v0Cor.r - v2Cor.r) / (v0.y - v2.y)), taxaG: ((v0Cor.g - v2Cor.g) / (v0.y - v2.y)), taxaB: ((v0Cor.b - v2Cor.b) / (v0.y - v2.y)) }]

      let lastIniX = arestas[0].ini.x, lastFimX = arestas[0].ini.x, swaped = false
      let lastIniColor = { r: v0Cor.r, g: v0Cor.g, b: v0Cor.b }, lastFimColor = { r: v0Cor.r, g: v0Cor.g, b: v0Cor.b }
      for (let y = v0.y; y < v1.y; y++) {
        lastIniX += arestas[0].taxa
        lastFimX += arestas[2].taxa
        let intervalo = [lastIniX, lastFimX]

        if (intervalo[1] < intervalo[0]) {
          const aux = intervalo[0]
          intervalo[0] = intervalo[1]
          intervalo[1] = aux
          swaped = true
        }

        intervalo[0] = Math.round(intervalo[0])
        intervalo[1] = Math.round(intervalo[1])

        lastIniColor = { r: lastIniColor.r + arestas[0].taxaR, g: lastIniColor.g + arestas[0].taxaG, b: lastIniColor.b + arestas[0].taxaB }
        lastFimColor = { r: lastFimColor.r + arestas[2].taxaR, g: lastFimColor.g + arestas[2].taxaG, b: lastFimColor.b + arestas[2].taxaB }

        if (swaped) {
          const aux = lastIniColor
          lastIniColor = lastFimColor
          lastFimColor = aux
        }

        const varX = intervalo[1] - intervalo[0]
        const delta = { r: (lastFimColor.r - lastIniColor.r) / varX, g: (lastFimColor.g - lastIniColor.g) / varX, b: (lastFimColor.b - lastIniColor.b) / varX }

        for (let j = intervalo[0], k = 0; j < intervalo[1]; j++, k++) {
          this.drawPixel(j, y, `rgb(${lastIniColor.r + delta.r * k}, ${lastIniColor.g + delta.g * k}, ${lastIniColor.b + delta.b * k})`)
        }
      }

      swaped = false
      lastIniColor = { r: v1Cor.r + arestas[1].taxaR, g: v1Cor.g + arestas[1].taxaG, b: v1Cor.b + arestas[1].taxaB }
      for (let y = v1.y; y < v2.y; y++) {
        lastIniX += arestas[1].taxa
        lastFimX += arestas[2].taxa
        let intervalo = [lastIniX, lastFimX]
        if (intervalo[1] < intervalo[0]) {
          const aux = intervalo[0]
          intervalo[0] = intervalo[1]
          intervalo[1] = aux
          swaped = true
        }

        intervalo[0] = Math.round(intervalo[0])
        intervalo[1] = Math.round(intervalo[1])

        lastIniColor = { r: lastIniColor.r + arestas[1].taxaR, g: lastIniColor.g + arestas[1].taxaG, b: lastIniColor.b + arestas[1].taxaB }
        lastFimColor = { r: lastFimColor.r + arestas[2].taxaR, g: lastFimColor.g + arestas[2].taxaG, b: lastFimColor.b + arestas[2].taxaB }
        if (swaped) {
          const aux = lastIniColor
          lastIniColor = lastFimColor
          lastFimColor = aux
        }

        const varX = intervalo[1] - intervalo[0]
        const delta = { r: (lastFimColor.r - lastIniColor.r) / varX, g: (lastFimColor.g - lastIniColor.g) / varX, b: (lastFimColor.b - lastIniColor.b) / varX }

        for (let j = intervalo[0], k = 0; j < intervalo[1]; j++, k++) {
          this.drawPixel(j, y, `rgb(${lastIniColor.r + delta.r * k}, ${lastIniColor.g + delta.g * k}, ${lastIniColor.b + delta.b * k})`)
        }
      }

    },
    hexToRgb(hex) {
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      return { r, g, b };
    }
  },
  mounted() {
    this.canvas = this.$refs['canvas'].getContext('2d')
  },
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
}

.wrapper {
  height: 780px;
  width: 1200px;
  overflow-y: hidden;
  overflow-x: scroll;
}

.quadro {
  border: solid;
  height: 760px;
  width: 1180px;
}

.controle {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px 0;
}

.dialog {
  text-align: center;
  width: 100%;
  background-color: #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
}

.listaLegenda {
  background-color: #ddd;
  border-radius: 5px;
  display: flex;
  font-size: small;
  justify-content: space-between;
  margin-bottom: 5px;
  margin-right: 15px;
  padding: 5px;
}

.itensLegenda {
  display: flex;
  justify-content: space-evenly;
  width: 170px;
}

.listaPoly {
  overflow-y: scroll;
  height: 300px;
}

.poly {
  display: flex;
  background-color: #ddd;
  border-radius: 5px;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 5px;
}

.vOps {
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  width: 150px;
}

.vCor {
  height: 20px;
  width: 20px;
}

.deleteIcon:hover {
  color: red;
  transition: .15s ease-in-out;
}

.botoes {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 85px;
}
</style>
