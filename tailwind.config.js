//Objeto con colores por defecto
const colors = require("tailwindcss/colors");
module.exports = {
  purge: {
    //Archivos en los que tiene que buscar que clases de tailwindcss se usan.
    enabled: true,
    content: ['./src/**/*.ejs', './src/**/*.js'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    //Fuentes personalizadas
    fontFamily: {
      Abel: ['Abel', 'sans-serif'],
      Hind: ['Hind', 'sans-serif'],
      sans: ['Mukta', 'sans-serif']
    },
    //Establece el tamaño maximo de los anchos
    maxWidth: {
      "3/5": "60%"
    },
    //Define todos los colores disponibles, evita la generacion de código
    //con clases con los colores, que no se llegan a usar. Los colores se separan en funcion
    //de su uso, para evitar la generación de codigo inecesario (los colores especificos se encuentran en extend)
    //Colores generales
    colors: {
      black: colors.black,
      white: colors.white,
      transparent: 'transparent',
      current: 'currentColor',
    },
    //Extendemos el tema base, esto permite que los estilos establecidos se añadan a
    //estilo por defecto.
    extend: {
      //Colores unicamente para los fondos
      backgroundColor: {
        // Color la cabecera (tambien se aplica en el footer)
        Cabecera: "#CD5C5C",
        //Color para cada el elemento del listado de usuarios
        Usuarios: "transparent",
        //Color para cada el elemento del listado de usuarios, hover
        Usuarioshv: "#008B8B",
        //Colores para los botones agrupados
        boton: {
          //Color de los botones confirmar
          confirm: 'transparent',
          //Color de los botones confirmar (Hover)
          confirmHv: '#729D9D',
          //Color de los botones cancelar
          cancelar: "transparent",
          //Color de los botones cancelar (Hover)
          cancelarHv: "#B22222",
          //Color para los botones desactivados
          des: "transparent"
        }
      },
      //Colores unicamente para los textos
      textColor: {
        //Todos los textos de la cabecera y footer
        Cabecera: "#FFF",
        //Color para los titulos
        titulos: "#B22222",
        //Color para los errores
        err: "#B22222",
        //Color para cada el elemento del listado de usuarios
        Usuarios: "#008B8B",
        //Color para cada el elemento del listado de usuarios, hover
        Usuarioshv: "#FFF",
        //Colores para los botones agrupados
        boton: {
          //Color de los botones confirmar
          confirm: "#729D9D",
          //Color de los botones confirmar (Hover)
          confirmHv: '#FFF',
          //Color de los botones cancelar
          cancelar: "#B22222",
          //Color de los botones cancelar (Hover)
          cancelarHv: "#FFF",
          //Color para los botones desactivados
          des: "#AAA"
        },
        //Colores para las etiquetas agrupados
        label: {
          //Color para etiqueta normal
          norm: "#656767",
          //Color para etiqueta desactivada
          des: "#333"
        },
        //Colores para los input
      },
      //Colores para los bordes
      borderColor: {
        //Color para el borde que rodea al contenido principal    #5CCD95
        main: "#5CCCB4",
        //Color para cada el elemento del listado de usuarios
        Usuarios: "#008B8B",
        //Color para cada el elemento del listado de usuarios, hover
        Usuarioshv: "transparent",
        //Color para los inputs agrupados
        input: {
          //Color de input con error
          err1: "#B22222",
          //Color de input con error, focus y hover
          err2: "#660000",
          //Color de input normal
          norm1: "#66CDAA",
          //Color de input normal. focus y hover
          norm2: "#008080",
          //Color de input desactivado
          des: "#4682B4"
        },
        //Color para los botones agrupados
        boton: {
          //Color de los botones confirmar
          confirm: "#729D9D",
          //Color de los botones confirmar (Hover)
          confirmHv: "transparent",
          //Color de los botones cancelar
          cancelar: "#B22222",
          //Color de los botones cancelar (Hover)
          cancelarHv: "transparent",
          //Color para los botones desactivados
          des: "#AAA"
        }

      },
      //Media querys personalizados
      screens: {
        's4': "400px" //media (min-width: 400px)
      }

    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
