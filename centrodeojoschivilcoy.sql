-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-07-2025 a las 00:12:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `centrodeojoschivilcoy`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `codigo_postal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_turno`
--

CREATE TABLE `estado_turno` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_turno`
--

INSERT INTO `estado_turno` (`id`, `nombre`) VALUES
(1, 'libre'),
(2, 'reservado'),
(3, 'confirmado'),
(4, 'completado'),
(5, 'cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historias_clinicas`
--

CREATE TABLE `historias_clinicas` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `antecedentes_personales` varchar(255) NOT NULL,
  `medicacion_actual` varchar(255) NOT NULL,
  `examen_clinico` varchar(255) NOT NULL,
  `diagnostico` varchar(255) NOT NULL,
  `tratamiento` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historias_clinicas`
--

INSERT INTO `historias_clinicas` (`id`, `fecha`, `id_paciente`, `motivo`, `antecedentes_personales`, `medicacion_actual`, `examen_clinico`, `diagnostico`, `tratamiento`) VALUES
(1, '2025-06-20 11:28:58', 5, 'Consulta actualizada', 'Miopía y astigmatismo.', 'Ninguna.', 'Examen del paciente.', 'Diagnóstico del paciente.', 'Tratamiento del paciente.'),
(2, '2025-06-24 14:47:36', 5, 'dsfsfs', 'fsfsfs', 'fsfsfs', 'fsfsfs', 'fs', 'fse'),
(3, '2025-06-24 14:52:56', 5, 'fsfs', 'fsfs', 'fsf', 'sfsf', 'sfsf', 'sfsf'),
(4, '2025-06-24 20:26:32', 5, 'dfdf', 'dfdf', 'dfd', 'dfdf', 'dfdf', 'dfdf'),
(5, '2025-06-24 20:26:40', 5, 'dfdfd', 'df', 'dfd', 'fd', 'fdf', 'dfdf'),
(6, '2025-06-24 20:26:49', 5, 'dfd', 'ff', 'df', 'df', 'dfdff', 'df'),
(7, '2025-06-24 20:29:01', 5, 'sfs', 'sfs', 'fsf', 'sfs', 'fsf', 'sfsf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id`, `id_medico`, `dia_semana`, `hora_inicio`, `hora_fin`) VALUES
(1, 1, 'lunes', '06:00:00', '15:00:00'),
(3, 1, 'lunes', '16:39:00', '21:35:00'),
(4, 1, 'martes', '10:00:00', '12:00:00'),
(5, 1, 'miercoles', '16:31:00', '20:35:00'),
(6, 1, 'miercoles', '10:00:00', '12:00:00'),
(7, 5, 'lunes', '16:51:00', '20:55:00'),
(8, 5, 'miercoles', '16:51:00', '20:55:00'),
(9, 1, 'jueves', '08:30:00', '12:30:00'),
(10, 1, 'viernes', '16:30:00', '20:30:00'),
(11, 1, 'sabado', '08:30:00', '10:30:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `matricula` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id`, `id_usuario`, `telefono`, `foto`, `descripcion`, `matricula`) VALUES
(1, 8, '3444', '/public\\uploads\\1751571096661.png', 'Actualizada', '111856'),
(5, 10, '2222222', '/public\\uploads\\1746818581613.png', 'Hola', '34422'),
(7, 11, '2346554433', '/public\\uploads\\1751668729292.png', 'fdfdfdf', '234345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos_practicas`
--

CREATE TABLE `medicos_practicas` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos_practicas`
--

INSERT INTO `medicos_practicas` (`id`, `id_medico`, `id_practica`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_horarios`
--

CREATE TABLE `medico_horarios` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_obrassociales`
--

CREATE TABLE `medico_obrassociales` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_obraSocial` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico_obrassociales`
--

INSERT INTO `medico_obrassociales` (`id`, `id_medico`, `id_obraSocial`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

CREATE TABLE `obras_sociales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id`, `nombre`) VALUES
(1, 'IOMA'),
(2, 'Swiss Medical'),
(3, 'OSPE'),
(4, 'OSDE'),
(5, 'Galeno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `dni` int(11) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('femenino','masculino','otro') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `id_obra_social` int(11) NOT NULL,
  `nro_afiliado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `dni`, `fecha_nacimiento`, `genero`, `direccion`, `email`, `telefono`, `id_obra_social`, `nro_afiliado`) VALUES
(5, 'Camila Ana Mazzaro', 44488835, '2002-09-24', 'femenino', 'Biedma 123', 'camilamazzaro90@gmail.com', '2346654466', 4, '12366655'),
(6, 'Camila Mazzaro', 44488835, '2025-06-14', 'femenino', 'Las Heras 122', 'camilamazzaro90@gmail.com', '2346665555', 1, '123'),
(7, 'Camila Mazzaro', 44488835, '2025-06-21', 'femenino', 'Las Heras 122', 'camilamazzaro90@gmail.com', '2346665555', 1, '123'),
(8, 'Juan Perez', 23333444, '1988-09-23', 'masculino', 'Junín 35', 'juanperez@gmail.com', '2344332225', 1, '23444555'),
(9, 'Esteban Gómez', 21322438, '1975-05-22', 'masculino', 'Junín 35', 'estebangomez@gmail.com', '2346554433', 2, '67999888'),
(10, 'Sofía Rodríguez', 30654321, '1985-07-20', 'femenino', 'Calle 25 de Mayo 678', 'sofia.rodriguez@gmail.com', '1122334455', 1, '101'),
(11, 'Juan Pérez', 30543210, '1990-05-14', 'masculino', 'Av. Rivadavia 1234', 'juan.perez@gmail.com', '1133445566', 2, '102'),
(12, 'Carlos Gómez', 30876543, '1978-11-30', 'masculino', 'Calle San Martín 45', 'carlos.gomez@yahoo.com', '1144556677', 3, '103'),
(13, 'Lucía López', 30223344, '2000-02-10', 'femenino', 'Calle Belgrano 210', 'lucia.lopez@hotmail.com', '1155667788', 4, '104'),
(14, 'Pedro González', 30987665, '1995-04-02', 'masculino', 'Calle Sarmiento 322', 'pedro.gonzalez@gmail.com', '1166778899', 5, '105'),
(15, 'Valentina Martínez', 30123456, '1998-09-08', 'femenino', 'Calle Corrientes 157', 'valentina.martinez@mail.com', '1177889900', 6, '106'),
(16, 'Martín Fernández', 30765498, '1983-01-18', 'masculino', 'Av. de Mayo 98', 'martin.fernandez@gmail.com', '1188990011', 7, '107'),
(17, 'Estefanía Díaz', 30678901, '1992-12-12', 'femenino', 'Calle Avellaneda 500', 'estefania.diaz@hotmail.com', '1199001122', 8, '108'),
(18, 'Ricardo Ramírez', 30456789, '1975-08-25', 'masculino', 'Calle Perú 345', 'ricardo.ramirez@yahoo.com', '1200112233', 9, '109'),
(19, 'Mariana Torres', 30987654, '1987-06-30', 'femenino', 'Av. Libertador 322', 'mariana.torres@gmail.com', '1211223344', 10, '110'),
(20, 'Tomás Herrera', 30567890, '1991-03-22', 'masculino', 'Calle H. Yrigoyen 789', 'tomas.herrera@mail.com', '1222334455', 11, '111'),
(21, 'Victoria Martínez', 30765432, '1989-05-16', 'femenino', 'Calle Güemes 120', 'victoria.martinez@gmail.com', '1233445566', 12, '112'),
(22, 'Federico Rodríguez', 30323456, '1994-07-07', 'masculino', 'Calle Moreno 678', 'federico.rodriguez@gmail.com', '1244556677', 13, '113'),
(23, 'Gabriela Sánchez', 30987632, '1990-09-21', 'femenino', 'Calle Pueyrredón 501', 'gabriela.sanchez@mail.com', '1255667788', 14, '114'),
(24, 'Ricardo Álvarez', 30412345, '1982-10-11', 'masculino', 'Calle Tucumán 900', 'ricardo.alvarez@gmail.com', '1266778899', 15, '115');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practicas`
--

CREATE TABLE `practicas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `practicas`
--

INSERT INTO `practicas` (`id`, `nombre`) VALUES
(1, 'consulta'),
(2, 'yag láser'),
(3, 'fondo de ojo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL,
  `id_practica` int(11) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  `id_estado_turno` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id`, `id_medico`, `id_paciente`, `id_practica`, `fecha_hora`, `id_estado_turno`) VALUES
(1, 1, 0, 1, '2025-07-02 13:20:00', 1),
(2, 1, 8, 1, '2025-07-03 18:00:00', 1),
(3, 1, 12, 2, '2025-07-03 13:01:00', 3),
(4, 1, 10, 1, '2025-07-03 14:41:00', 3),
(5, 1, 6, 3, '2025-07-03 17:44:00', 3),
(6, 1, 12, 1, '2025-07-03 14:41:00', 3),
(7, 1, 7, 1, '2025-07-03 16:44:00', 3),
(8, 1, NULL, NULL, '2025-07-03 08:30:00', 1),
(9, 1, NULL, NULL, '2025-07-03 08:45:00', 1),
(10, 1, NULL, NULL, '2025-07-03 09:00:00', 1),
(11, 1, NULL, NULL, '2025-07-03 09:15:00', 1),
(12, 1, NULL, NULL, '2025-07-03 09:30:00', 1),
(13, 1, NULL, NULL, '2025-07-03 09:45:00', 1),
(14, 1, NULL, NULL, '2025-07-03 10:00:00', 1),
(15, 1, NULL, NULL, '2025-07-03 10:15:00', 1),
(16, 1, NULL, NULL, '2025-07-03 10:30:00', 1),
(17, 1, NULL, NULL, '2025-07-03 10:45:00', 1),
(18, 1, NULL, NULL, '2025-07-03 11:00:00', 1),
(19, 1, NULL, NULL, '2025-07-03 11:15:00', 1),
(20, 1, NULL, NULL, '2025-07-03 11:30:00', 1),
(21, 1, NULL, NULL, '2025-07-03 11:45:00', 1),
(22, 1, NULL, NULL, '2025-07-03 12:00:00', 1),
(23, 1, NULL, NULL, '2025-07-03 12:15:00', 1),
(24, 1, NULL, NULL, '2025-07-04 16:30:00', 1),
(25, 1, NULL, NULL, '2025-07-04 16:45:00', 1),
(26, 1, NULL, NULL, '2025-07-04 17:00:00', 1),
(27, 1, NULL, NULL, '2025-07-04 17:15:00', 1),
(28, 1, NULL, NULL, '2025-07-04 17:30:00', 1),
(29, 1, NULL, NULL, '2025-07-04 17:45:00', 1),
(30, 1, NULL, NULL, '2025-07-04 18:00:00', 1),
(31, 1, NULL, NULL, '2025-07-04 18:15:00', 1),
(32, 1, NULL, NULL, '2025-07-04 18:30:00', 1),
(33, 1, NULL, NULL, '2025-07-04 18:45:00', 1),
(34, 1, NULL, NULL, '2025-07-04 19:00:00', 1),
(35, 1, NULL, NULL, '2025-07-04 19:15:00', 1),
(36, 1, NULL, NULL, '2025-07-04 19:30:00', 1),
(37, 1, NULL, NULL, '2025-07-04 19:45:00', 1),
(38, 1, NULL, NULL, '2025-07-04 20:00:00', 1),
(39, 1, NULL, NULL, '2025-07-04 20:15:00', 1),
(40, 1, NULL, NULL, '2025-07-05 08:30:00', 1),
(41, 1, NULL, NULL, '2025-07-05 08:45:00', 1),
(42, 1, NULL, NULL, '2025-07-05 09:00:00', 1),
(43, 1, NULL, NULL, '2025-07-05 09:15:00', 1),
(44, 1, NULL, NULL, '2025-07-05 09:30:00', 1),
(45, 1, NULL, NULL, '2025-07-05 09:45:00', 1),
(46, 1, NULL, NULL, '2025-07-05 10:00:00', 1),
(47, 1, NULL, NULL, '2025-07-05 10:15:00', 1),
(48, 1, NULL, NULL, '2025-07-08 10:00:00', 1),
(49, 1, NULL, NULL, '2025-07-08 10:15:00', 1),
(50, 1, NULL, NULL, '2025-07-08 10:30:00', 1),
(51, 1, NULL, NULL, '2025-07-08 10:45:00', 1),
(52, 1, NULL, NULL, '2025-07-08 11:00:00', 1),
(53, 1, NULL, NULL, '2025-07-08 11:15:00', 1),
(54, 1, NULL, NULL, '2025-07-08 11:30:00', 1),
(55, 1, NULL, NULL, '2025-07-08 11:45:00', 1),
(56, 1, NULL, NULL, '2025-07-09 16:31:00', 1),
(57, 1, NULL, NULL, '2025-07-09 16:46:00', 1),
(58, 1, NULL, NULL, '2025-07-09 17:01:00', 1),
(59, 1, NULL, NULL, '2025-07-09 17:16:00', 1),
(60, 1, NULL, NULL, '2025-07-09 17:31:00', 1),
(61, 1, NULL, NULL, '2025-07-09 17:46:00', 1),
(62, 1, NULL, NULL, '2025-07-09 18:01:00', 1),
(63, 1, NULL, NULL, '2025-07-09 18:16:00', 1),
(64, 1, NULL, NULL, '2025-07-09 18:31:00', 1),
(65, 1, NULL, NULL, '2025-07-09 18:46:00', 1),
(66, 1, NULL, NULL, '2025-07-09 19:01:00', 1),
(67, 1, NULL, NULL, '2025-07-09 19:16:00', 1),
(68, 1, NULL, NULL, '2025-07-09 19:31:00', 1),
(69, 1, NULL, NULL, '2025-07-09 19:46:00', 1),
(70, 1, NULL, NULL, '2025-07-09 20:01:00', 1),
(71, 1, NULL, NULL, '2025-07-09 20:16:00', 1),
(72, 1, NULL, NULL, '2025-07-09 20:31:00', 1),
(73, 1, NULL, NULL, '2025-07-09 10:00:00', 1),
(74, 1, NULL, NULL, '2025-07-09 10:15:00', 1),
(75, 1, NULL, NULL, '2025-07-09 10:30:00', 1),
(76, 1, NULL, NULL, '2025-07-09 10:45:00', 1),
(77, 1, NULL, NULL, '2025-07-09 11:00:00', 1),
(78, 1, NULL, NULL, '2025-07-09 11:15:00', 1),
(79, 1, NULL, NULL, '2025-07-09 11:30:00', 1),
(80, 1, NULL, NULL, '2025-07-09 11:45:00', 1),
(81, 5, NULL, NULL, '2025-07-09 16:51:00', 1),
(82, 5, NULL, NULL, '2025-07-09 17:06:00', 1),
(83, 5, NULL, NULL, '2025-07-09 17:21:00', 1),
(84, 5, NULL, NULL, '2025-07-09 17:36:00', 1),
(85, 5, NULL, NULL, '2025-07-09 17:51:00', 1),
(86, 5, NULL, NULL, '2025-07-09 18:06:00', 1),
(87, 5, NULL, NULL, '2025-07-09 18:21:00', 1),
(88, 5, NULL, NULL, '2025-07-09 18:36:00', 1),
(89, 5, NULL, NULL, '2025-07-09 18:51:00', 1),
(90, 5, NULL, NULL, '2025-07-09 19:06:00', 1),
(91, 5, NULL, NULL, '2025-07-09 19:21:00', 1),
(92, 5, NULL, NULL, '2025-07-09 19:36:00', 1),
(93, 5, NULL, NULL, '2025-07-09 19:51:00', 1),
(94, 5, NULL, NULL, '2025-07-09 20:06:00', 1),
(95, 5, NULL, NULL, '2025-07-09 20:21:00', 1),
(96, 5, NULL, NULL, '2025-07-09 20:36:00', 1),
(97, 5, NULL, NULL, '2025-07-09 20:51:00', 1),
(98, 1, NULL, NULL, '2025-07-10 08:30:00', 1),
(99, 1, NULL, NULL, '2025-07-10 08:45:00', 1),
(100, 1, NULL, NULL, '2025-07-10 09:00:00', 1),
(101, 1, NULL, NULL, '2025-07-10 09:15:00', 1),
(102, 1, NULL, NULL, '2025-07-10 09:30:00', 1),
(103, 1, NULL, NULL, '2025-07-10 09:45:00', 1),
(104, 1, NULL, NULL, '2025-07-10 10:00:00', 1),
(105, 1, NULL, NULL, '2025-07-10 10:15:00', 1),
(106, 1, NULL, NULL, '2025-07-10 10:30:00', 1),
(107, 1, NULL, NULL, '2025-07-10 10:45:00', 1),
(108, 1, NULL, NULL, '2025-07-10 11:00:00', 1),
(109, 1, NULL, NULL, '2025-07-10 11:15:00', 1),
(110, 1, NULL, NULL, '2025-07-10 11:30:00', 1),
(111, 1, NULL, NULL, '2025-07-10 11:45:00', 1),
(112, 1, NULL, NULL, '2025-07-10 12:00:00', 1),
(113, 1, NULL, NULL, '2025-07-10 12:15:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno_estados`
--

CREATE TABLE `turno_estados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turno_estados`
--

INSERT INTO `turno_estados` (`id`, `nombre`) VALUES
(1, 'libre'),
(2, 'reservado'),
(3, 'confirmado'),
(4, 'completado'),
(5, 'cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_categoriaUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `id_categoriaUsuario`) VALUES
(2, 'Camila Mazzaro', 'camilamazzaro90@gmail.com', '*******', 1),
(8, 'Esteban Mazzaro', 'estebanmazzaro@gmail.com', 'Camila123', 2),
(9, 'Bruno Mazzaro', 'camilamazzaro90@gmail.com', 'Camila123', 2),
(10, 'Mariano Mengide', 'mariano@gmail.com', 'Camila123', 2),
(11, 'Hernán Ghersi', 'hernan@gmail.com', 'Camila123', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_categorias`
--

CREATE TABLE `usuario_categorias` (
  `id` int(11) NOT NULL,
  `categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_categorias`
--

INSERT INTO `usuario_categorias` (`id`, `categoria`) VALUES
(1, 'Administrador'),
(2, 'Medico'),
(3, 'Secretaria');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_turno`
--
ALTER TABLE `estado_turno`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medicos_practicas`
--
ALTER TABLE `medicos_practicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medico_horarios`
--
ALTER TABLE `medico_horarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medico_obrassociales`
--
ALTER TABLE `medico_obrassociales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `practicas`
--
ALTER TABLE `practicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `turno_estados`
--
ALTER TABLE `turno_estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario_categorias`
--
ALTER TABLE `usuario_categorias`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_turno`
--
ALTER TABLE `estado_turno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `medicos_practicas`
--
ALTER TABLE `medicos_practicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `medico_horarios`
--
ALTER TABLE `medico_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medico_obrassociales`
--
ALTER TABLE `medico_obrassociales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `practicas`
--
ALTER TABLE `practicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT de la tabla `turno_estados`
--
ALTER TABLE `turno_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuario_categorias`
--
ALTER TABLE `usuario_categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
