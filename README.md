pluma-duino
===========
### This app handles the commnication between the arduino board (with  all the user specific components) and the [pluma](https://github.com/dpaez/pluma) HW sketching app.

## Instalación

#### Requisitos Previos:
- node.js instalado (ver [nodejs.org](http://nodejs.org/))
- [opcional/recomendado] Contar con [nvm](https://github.com/creationix/nvm) instalado o algun manejador de versiones de node.
- contar con placa arduino uno o similar conectada y lista para usar (mas info en: [johnny-five](https://github.com/rwaldron/johnny-five))
 
#### Luego:

1. ``` git clone https://github.com/dpaez/pluma-duino.git && cd pluma-duino ```
2. ``` npm install ```
3. ``` node board.js ```


En la carpeta ```components``` encontrará algunos componentes (SW + HW) comunes creados a modo de ejemplo. Si necesita crear nuevos componentes puede basarse en estos. La unica restricción es ubicarlos dentro de este directorio para que la aplicación *pluma* pueda detectarlos.


