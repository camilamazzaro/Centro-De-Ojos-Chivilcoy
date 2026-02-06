-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-02-2026 a las 20:40:51
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
(7, '2025-06-24 20:29:01', 5, 'sfs', 'sfs', 'fsf', 'sfs', 'fsf', 'sfsf'),
(8, '2026-01-13 17:01:18', 7, 'Hola', 'cscscs', 'cscscs', 'cscs', 'cscsc', 'scscsc');

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
(11, 1, 'sabado', '08:30:00', '10:30:00'),
(12, 1, 'miercoles', '19:28:00', '22:31:00');

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
(1, 8, '2346447799', '/public\\uploads\\1770406141337.jpeg', 'Descripción del Médico', '111856'),
(5, 10, '2345667788', '/public\\uploads\\1770334397270.jpeg', 'Descripción del médico', '34422'),
(20, 20, '2346554433', '/public\\uploads\\1770406127382.jpeg', 'Descripción del médico', '127766');

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
(7, 'Camila Mazzaro', 44488835, '2026-02-05', '', NULL, 'camimazzari11@gmail.com', '2346554433', 1, '34343'),
(8, 'Juan Carlos Pérez', 23333444, '1978-03-23', 'masculino', 'Las Heras 122', 'juanperez@gmail.com', '2346691870', 2, '23455'),
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
(24, 'Ricardo Álvarez', 30412345, '1982-10-11', 'masculino', 'Calle Tucumán 900', 'ricardo.alvarez@gmail.com', '1266778899', 15, '115'),
(28, 'Esteban Martínez', 30222555, '2025-07-08', 'masculino', 'Las Heras 122', 'estebanmartinez@gmail.com', '2346554433', 1, '12366655');

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
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `id` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `tratamiento` text NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `indicaciones` text DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `firma_manuscrita` tinyint(1) DEFAULT 0,
  `firma_digital` tinyint(1) DEFAULT 0,
  `copias` enum('sin','duplicado','triplicado') DEFAULT 'sin',
  `formato_pdf` enum('A4','A5') DEFAULT 'A4',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archivo_firma_manuscrita` varchar(255) DEFAULT NULL,
  `archivo_firma_digital` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recetas`
--

INSERT INTO `recetas` (`id`, `id_paciente`, `id_medico`, `fecha`, `tratamiento`, `diagnostico`, `indicaciones`, `comentarios`, `firma_manuscrita`, `firma_digital`, `copias`, `formato_pdf`, `created_at`, `archivo_firma_manuscrita`, `archivo_firma_digital`) VALUES
(1, 7, 1, '2026-01-13', 'Carboximetilcelulosa 0.5% (Lágrimas artificiales) y Gel oftálmico nocturno.', 'Síndrome de ojo seco moderado y fatiga visual.', 'Colocar 1 gota en ambos ojos (AO) cada 6 horas o a demanda ante sensación de arenilla. Gel: una aplicación antes de dormir.', 'Se sugiere la regla 20-20-20 para el uso de pantallas. Control de presión intraocular en 6 meses.', 1, 0, 'duplicado', 'A4', '2026-01-13 19:39:37', '1770406784368.png', NULL),
(4, 7, 5, '2026-02-06', 'Tobramicina 0.3% + Dexametasona (Gotas oftálmicas).', 'Conjuntivitis bacteriana aguda en Ojo Derecho (OD).', 'Aplicar 1 gota en el ojo afectado cada 4 horas durante 7 días. Lavarse las manos antes y después de la aplicación.', 'Suspender el uso de lentes de contacto hasta el alta médica. Realizar higiene de párpados con solución fisiológica.', 1, 0, 'sin', 'A4', '2026-01-15 00:59:10', '1770406771999.png', NULL);

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
(7, 1, NULL, 1, '2025-07-03 16:44:00', 1),
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
(113, 1, NULL, NULL, '2025-07-10 12:15:00', 1),
(114, 1, 7, 3, '2026-01-06 22:01:00', 3),
(115, 1, NULL, NULL, '2026-01-05 06:00:00', 1),
(116, 1, NULL, NULL, '2026-01-05 06:15:00', 1),
(117, 1, NULL, NULL, '2026-01-05 06:30:00', 1),
(118, 1, NULL, NULL, '2026-01-05 06:45:00', 1),
(119, 1, NULL, NULL, '2026-01-05 07:00:00', 1),
(120, 1, NULL, NULL, '2026-01-05 07:15:00', 1),
(121, 1, NULL, NULL, '2026-01-05 07:30:00', 1),
(122, 1, NULL, NULL, '2026-01-05 07:45:00', 1),
(123, 1, NULL, NULL, '2026-01-05 08:00:00', 1),
(124, 1, NULL, NULL, '2026-01-05 08:15:00', 1),
(125, 1, NULL, NULL, '2026-01-05 08:30:00', 1),
(126, 1, NULL, NULL, '2026-01-05 08:45:00', 1),
(127, 1, NULL, NULL, '2026-01-05 09:00:00', 1),
(128, 1, NULL, NULL, '2026-01-05 09:15:00', 1),
(129, 1, NULL, NULL, '2026-01-05 09:30:00', 1),
(130, 1, NULL, NULL, '2026-01-05 09:45:00', 1),
(131, 1, NULL, NULL, '2026-01-05 10:00:00', 1),
(132, 1, NULL, NULL, '2026-01-05 10:15:00', 1),
(133, 1, NULL, NULL, '2026-01-05 10:30:00', 1),
(134, 1, NULL, NULL, '2026-01-05 10:45:00', 1),
(135, 1, NULL, NULL, '2026-01-05 11:00:00', 1),
(136, 1, NULL, NULL, '2026-01-05 11:15:00', 1),
(137, 1, NULL, NULL, '2026-01-05 11:30:00', 1),
(138, 1, NULL, NULL, '2026-01-05 11:45:00', 1),
(139, 1, NULL, NULL, '2026-01-05 12:00:00', 1),
(140, 1, NULL, NULL, '2026-01-05 12:15:00', 1),
(141, 1, NULL, NULL, '2026-01-05 12:30:00', 1),
(142, 1, NULL, NULL, '2026-01-05 12:45:00', 1),
(143, 1, NULL, NULL, '2026-01-05 13:00:00', 1),
(144, 1, NULL, NULL, '2026-01-05 13:15:00', 1),
(145, 1, NULL, NULL, '2026-01-05 13:30:00', 1),
(146, 1, NULL, NULL, '2026-01-05 13:45:00', 1),
(147, 1, NULL, NULL, '2026-01-05 14:00:00', 1),
(148, 1, NULL, NULL, '2026-01-05 14:15:00', 1),
(149, 1, NULL, NULL, '2026-01-05 14:30:00', 1),
(150, 1, NULL, NULL, '2026-01-05 14:45:00', 1),
(151, 1, NULL, NULL, '2026-01-05 16:39:00', 1),
(152, 1, NULL, NULL, '2026-01-05 16:54:00', 1),
(153, 1, NULL, NULL, '2026-01-05 17:09:00', 1),
(154, 1, NULL, NULL, '2026-01-05 17:24:00', 1),
(155, 1, NULL, NULL, '2026-01-05 17:39:00', 1),
(156, 1, NULL, NULL, '2026-01-05 17:54:00', 1),
(157, 1, NULL, NULL, '2026-01-05 18:09:00', 1),
(158, 1, NULL, NULL, '2026-01-05 18:24:00', 1),
(159, 1, NULL, NULL, '2026-01-05 18:39:00', 1),
(160, 1, NULL, NULL, '2026-01-05 18:54:00', 1),
(161, 1, NULL, NULL, '2026-01-05 19:09:00', 1),
(162, 1, NULL, NULL, '2026-01-05 19:24:00', 1),
(163, 1, NULL, NULL, '2026-01-05 19:39:00', 1),
(164, 1, NULL, NULL, '2026-01-05 19:54:00', 1),
(165, 1, NULL, NULL, '2026-01-05 20:09:00', 1),
(166, 1, NULL, NULL, '2026-01-05 20:24:00', 1),
(167, 1, NULL, NULL, '2026-01-05 20:39:00', 1),
(168, 1, NULL, NULL, '2026-01-05 20:54:00', 1),
(169, 1, NULL, NULL, '2026-01-05 21:09:00', 1),
(170, 1, NULL, NULL, '2026-01-05 21:24:00', 1),
(171, 5, NULL, NULL, '2026-01-05 16:51:00', 1),
(172, 5, NULL, NULL, '2026-01-05 17:06:00', 1),
(173, 5, NULL, NULL, '2026-01-05 17:21:00', 1),
(174, 5, NULL, NULL, '2026-01-05 17:36:00', 1),
(175, 5, NULL, NULL, '2026-01-05 17:51:00', 1),
(176, 5, NULL, NULL, '2026-01-05 18:06:00', 1),
(177, 5, NULL, NULL, '2026-01-05 18:21:00', 1),
(178, 5, NULL, NULL, '2026-01-05 18:36:00', 1),
(179, 5, NULL, NULL, '2026-01-05 18:51:00', 1),
(180, 5, NULL, NULL, '2026-01-05 19:06:00', 1),
(181, 5, NULL, NULL, '2026-01-05 19:21:00', 1),
(182, 5, NULL, NULL, '2026-01-05 19:36:00', 1),
(183, 5, NULL, NULL, '2026-01-05 19:51:00', 1),
(184, 5, NULL, NULL, '2026-01-05 20:06:00', 1),
(185, 5, NULL, NULL, '2026-01-05 20:21:00', 1),
(186, 5, NULL, NULL, '2026-01-05 20:36:00', 1),
(187, 5, NULL, NULL, '2026-01-05 20:51:00', 1),
(188, 1, NULL, NULL, '2026-01-06 10:00:00', 1),
(189, 1, NULL, NULL, '2026-01-06 10:15:00', 1),
(190, 1, NULL, NULL, '2026-01-06 10:30:00', 1),
(191, 1, NULL, NULL, '2026-01-06 10:45:00', 1),
(192, 1, NULL, NULL, '2026-01-06 11:00:00', 1),
(193, 1, NULL, NULL, '2026-01-06 11:15:00', 1),
(194, 1, NULL, NULL, '2026-01-06 11:30:00', 1),
(195, 1, NULL, NULL, '2026-01-06 11:45:00', 1),
(196, 1, NULL, NULL, '2026-01-07 16:31:00', 1),
(197, 1, NULL, NULL, '2026-01-07 16:46:00', 1),
(198, 1, NULL, NULL, '2026-01-07 17:01:00', 1),
(199, 1, NULL, NULL, '2026-01-07 17:16:00', 1),
(200, 1, NULL, NULL, '2026-01-07 17:31:00', 1),
(201, 1, NULL, NULL, '2026-01-07 17:46:00', 1),
(202, 1, NULL, NULL, '2026-01-07 18:01:00', 1),
(203, 1, NULL, NULL, '2026-01-07 18:16:00', 1),
(204, 1, NULL, NULL, '2026-01-07 18:31:00', 1),
(205, 1, NULL, NULL, '2026-01-07 18:46:00', 1),
(206, 1, NULL, NULL, '2026-01-07 19:01:00', 1),
(207, 1, NULL, NULL, '2026-01-07 19:16:00', 1),
(208, 1, NULL, NULL, '2026-01-07 19:31:00', 1),
(209, 1, NULL, NULL, '2026-01-07 19:46:00', 1),
(210, 1, NULL, NULL, '2026-01-07 20:01:00', 1),
(211, 1, NULL, NULL, '2026-01-07 20:16:00', 1),
(212, 1, NULL, NULL, '2026-01-07 20:31:00', 1),
(213, 1, NULL, NULL, '2026-01-07 10:00:00', 1),
(214, 1, NULL, NULL, '2026-01-07 10:15:00', 1),
(215, 1, NULL, NULL, '2026-01-07 10:30:00', 1),
(216, 1, NULL, NULL, '2026-01-07 10:45:00', 1),
(217, 1, NULL, NULL, '2026-01-07 11:00:00', 1),
(218, 1, NULL, NULL, '2026-01-07 11:15:00', 1),
(219, 1, NULL, NULL, '2026-01-07 11:30:00', 1),
(220, 1, NULL, NULL, '2026-01-07 11:45:00', 1),
(221, 5, NULL, NULL, '2026-01-07 16:51:00', 1),
(222, 5, NULL, NULL, '2026-01-07 17:06:00', 1),
(223, 5, NULL, NULL, '2026-01-07 17:21:00', 1),
(224, 5, NULL, NULL, '2026-01-07 17:36:00', 1),
(225, 5, NULL, NULL, '2026-01-07 17:51:00', 1),
(226, 5, NULL, NULL, '2026-01-07 18:06:00', 1),
(227, 5, NULL, NULL, '2026-01-07 18:21:00', 1),
(228, 5, NULL, NULL, '2026-01-07 18:36:00', 1),
(229, 5, NULL, NULL, '2026-01-07 18:51:00', 1),
(230, 5, NULL, NULL, '2026-01-07 19:06:00', 1),
(231, 5, NULL, NULL, '2026-01-07 19:21:00', 1),
(232, 5, NULL, NULL, '2026-01-07 19:36:00', 1),
(233, 5, NULL, NULL, '2026-01-07 19:51:00', 1),
(234, 5, NULL, NULL, '2026-01-07 20:06:00', 1),
(235, 5, NULL, NULL, '2026-01-07 20:21:00', 1),
(236, 5, NULL, NULL, '2026-01-07 20:36:00', 1),
(237, 5, NULL, NULL, '2026-01-07 20:51:00', 1),
(238, 1, NULL, NULL, '2026-01-08 08:30:00', 1),
(239, 1, NULL, NULL, '2026-01-08 08:45:00', 1),
(240, 1, 7, NULL, '2026-01-08 09:00:00', 3),
(241, 1, NULL, NULL, '2026-01-08 09:15:00', 1),
(242, 1, NULL, NULL, '2026-01-08 09:30:00', 1),
(243, 1, NULL, NULL, '2026-01-08 09:45:00', 1),
(244, 1, NULL, NULL, '2026-01-08 10:00:00', 1),
(245, 1, 7, 2, '2026-01-08 10:15:00', 3),
(246, 1, NULL, NULL, '2026-01-08 10:30:00', 1),
(247, 1, NULL, NULL, '2026-01-08 10:45:00', 1),
(248, 1, NULL, NULL, '2026-01-08 11:00:00', 1),
(249, 1, NULL, NULL, '2026-01-08 11:15:00', 1),
(250, 1, NULL, NULL, '2026-01-08 11:30:00', 1),
(251, 1, NULL, NULL, '2026-01-08 11:45:00', 1),
(252, 1, NULL, NULL, '2026-01-08 12:00:00', 1),
(253, 1, NULL, NULL, '2026-01-08 12:15:00', 1),
(254, 1, NULL, NULL, '2026-01-09 16:30:00', 1),
(255, 1, NULL, NULL, '2026-01-09 16:45:00', 1),
(256, 1, NULL, NULL, '2026-01-09 17:00:00', 1),
(257, 1, NULL, NULL, '2026-01-09 17:15:00', 1),
(258, 1, NULL, NULL, '2026-01-09 17:30:00', 1),
(259, 1, NULL, NULL, '2026-01-09 17:45:00', 1),
(260, 1, NULL, NULL, '2026-01-09 18:00:00', 1),
(261, 1, NULL, NULL, '2026-01-09 18:15:00', 1),
(262, 1, NULL, NULL, '2026-01-09 18:30:00', 1),
(263, 1, NULL, NULL, '2026-01-09 18:45:00', 1),
(264, 1, NULL, NULL, '2026-01-09 19:00:00', 1),
(265, 1, NULL, NULL, '2026-01-09 19:15:00', 1),
(266, 1, NULL, NULL, '2026-01-09 19:30:00', 1),
(267, 1, NULL, NULL, '2026-01-09 19:45:00', 1),
(268, 1, NULL, NULL, '2026-01-09 20:00:00', 1),
(269, 1, NULL, NULL, '2026-01-09 20:15:00', 1),
(270, 1, NULL, NULL, '2026-01-10 08:30:00', 1),
(271, 1, NULL, NULL, '2026-01-10 08:45:00', 1),
(272, 1, NULL, NULL, '2026-01-10 09:00:00', 1),
(273, 1, NULL, NULL, '2026-01-10 09:15:00', 1),
(274, 1, NULL, NULL, '2026-01-10 09:30:00', 1),
(275, 1, NULL, NULL, '2026-01-10 09:45:00', 1),
(276, 1, NULL, NULL, '2026-01-10 10:00:00', 1),
(277, 1, NULL, NULL, '2026-01-10 10:15:00', 1),
(278, 1, NULL, NULL, '2026-01-12 06:00:00', 1),
(279, 1, NULL, NULL, '2026-01-12 06:15:00', 1),
(280, 1, NULL, NULL, '2026-01-12 06:30:00', 1),
(281, 1, NULL, NULL, '2026-01-12 06:45:00', 1),
(282, 1, NULL, NULL, '2026-01-12 07:00:00', 1),
(283, 1, NULL, NULL, '2026-01-12 07:15:00', 1),
(284, 1, NULL, NULL, '2026-01-12 07:30:00', 1),
(285, 1, NULL, NULL, '2026-01-12 07:45:00', 1),
(286, 1, NULL, NULL, '2026-01-12 08:00:00', 1),
(287, 1, NULL, NULL, '2026-01-12 08:15:00', 1),
(288, 1, NULL, NULL, '2026-01-12 08:30:00', 1),
(289, 1, NULL, NULL, '2026-01-12 08:45:00', 1),
(290, 1, NULL, NULL, '2026-01-12 09:00:00', 1),
(291, 1, NULL, NULL, '2026-01-12 09:15:00', 1),
(292, 1, NULL, NULL, '2026-01-12 09:30:00', 1),
(293, 1, NULL, NULL, '2026-01-12 09:45:00', 1),
(294, 1, NULL, NULL, '2026-01-12 10:00:00', 1),
(295, 1, NULL, NULL, '2026-01-12 10:15:00', 1),
(296, 1, NULL, NULL, '2026-01-12 10:30:00', 1),
(297, 1, NULL, NULL, '2026-01-12 10:45:00', 1),
(298, 1, NULL, NULL, '2026-01-12 11:00:00', 1),
(299, 1, NULL, NULL, '2026-01-12 11:15:00', 1),
(300, 1, NULL, NULL, '2026-01-12 11:30:00', 1),
(301, 1, NULL, NULL, '2026-01-12 11:45:00', 1),
(302, 1, NULL, NULL, '2026-01-12 12:00:00', 1),
(303, 1, NULL, NULL, '2026-01-12 12:15:00', 1),
(304, 1, NULL, NULL, '2026-01-12 12:30:00', 1),
(305, 1, NULL, NULL, '2026-01-12 12:45:00', 1),
(306, 1, NULL, NULL, '2026-01-12 13:00:00', 1),
(307, 1, NULL, NULL, '2026-01-12 13:15:00', 1),
(308, 1, NULL, NULL, '2026-01-12 13:30:00', 1),
(309, 1, NULL, NULL, '2026-01-12 13:45:00', 1),
(310, 1, NULL, NULL, '2026-01-12 14:00:00', 1),
(311, 1, NULL, NULL, '2026-01-12 14:15:00', 1),
(312, 1, NULL, NULL, '2026-01-12 14:30:00', 1),
(313, 1, NULL, NULL, '2026-01-12 14:45:00', 1),
(314, 1, NULL, NULL, '2026-01-12 16:39:00', 1),
(315, 1, NULL, NULL, '2026-01-12 16:54:00', 1),
(316, 1, NULL, NULL, '2026-01-12 17:09:00', 1),
(317, 1, NULL, NULL, '2026-01-12 17:24:00', 1),
(318, 1, NULL, NULL, '2026-01-12 17:39:00', 1),
(319, 1, NULL, NULL, '2026-01-12 17:54:00', 1),
(320, 1, NULL, NULL, '2026-01-12 18:09:00', 1),
(321, 1, NULL, NULL, '2026-01-12 18:24:00', 1),
(322, 1, NULL, NULL, '2026-01-12 18:39:00', 1),
(323, 1, NULL, NULL, '2026-01-12 18:54:00', 1),
(324, 1, NULL, NULL, '2026-01-12 19:09:00', 1),
(325, 1, NULL, NULL, '2026-01-12 19:24:00', 1),
(326, 1, NULL, NULL, '2026-01-12 19:39:00', 1),
(327, 1, NULL, NULL, '2026-01-12 19:54:00', 1),
(328, 1, NULL, NULL, '2026-01-12 20:09:00', 1),
(329, 1, NULL, NULL, '2026-01-12 20:24:00', 1),
(330, 1, NULL, NULL, '2026-01-12 20:39:00', 1),
(331, 1, NULL, NULL, '2026-01-12 20:54:00', 1),
(332, 1, NULL, NULL, '2026-01-12 21:09:00', 1),
(333, 1, NULL, NULL, '2026-01-12 21:24:00', 1),
(334, 5, NULL, NULL, '2026-01-12 16:51:00', 1),
(335, 5, NULL, NULL, '2026-01-12 17:06:00', 1),
(336, 5, NULL, NULL, '2026-01-12 17:21:00', 1),
(337, 5, NULL, NULL, '2026-01-12 17:36:00', 1),
(338, 5, NULL, NULL, '2026-01-12 17:51:00', 1),
(339, 5, NULL, NULL, '2026-01-12 18:06:00', 1),
(340, 5, NULL, NULL, '2026-01-12 18:21:00', 1),
(341, 5, NULL, NULL, '2026-01-12 18:36:00', 1),
(342, 5, NULL, NULL, '2026-01-12 18:51:00', 1),
(343, 5, NULL, NULL, '2026-01-12 19:06:00', 1),
(344, 5, NULL, NULL, '2026-01-12 19:21:00', 1),
(345, 5, NULL, NULL, '2026-01-12 19:36:00', 1),
(346, 5, NULL, NULL, '2026-01-12 19:51:00', 1),
(347, 5, NULL, NULL, '2026-01-12 20:06:00', 1),
(348, 5, NULL, NULL, '2026-01-12 20:21:00', 1),
(349, 5, NULL, NULL, '2026-01-12 20:36:00', 1),
(350, 5, NULL, NULL, '2026-01-12 20:51:00', 1),
(351, 1, NULL, NULL, '2026-01-13 10:00:00', 1),
(352, 1, NULL, NULL, '2026-01-13 10:15:00', 1),
(353, 1, NULL, NULL, '2026-01-13 10:30:00', 1),
(354, 1, 7, NULL, '2026-01-13 10:45:00', 3),
(355, 1, NULL, NULL, '2026-01-13 11:00:00', 1),
(356, 1, NULL, NULL, '2026-01-13 11:15:00', 1),
(357, 1, NULL, NULL, '2026-01-13 11:30:00', 1),
(358, 1, NULL, NULL, '2026-01-13 11:45:00', 1),
(359, 1, NULL, NULL, '2026-01-14 16:31:00', 1),
(360, 1, NULL, NULL, '2026-01-14 16:46:00', 1),
(361, 1, NULL, NULL, '2026-01-14 17:01:00', 1),
(362, 1, NULL, NULL, '2026-01-14 17:16:00', 1),
(363, 1, NULL, NULL, '2026-01-14 17:31:00', 1),
(364, 1, NULL, NULL, '2026-01-14 17:46:00', 1),
(365, 1, NULL, NULL, '2026-01-14 18:01:00', 1),
(366, 1, NULL, NULL, '2026-01-14 18:16:00', 1),
(367, 1, NULL, NULL, '2026-01-14 18:31:00', 1),
(368, 1, NULL, NULL, '2026-01-14 18:46:00', 1),
(369, 1, NULL, NULL, '2026-01-14 19:01:00', 1),
(370, 1, NULL, NULL, '2026-01-14 19:16:00', 1),
(371, 1, NULL, NULL, '2026-01-14 19:31:00', 1),
(372, 1, NULL, NULL, '2026-01-14 19:46:00', 1),
(373, 1, NULL, NULL, '2026-01-14 20:01:00', 1),
(374, 1, NULL, NULL, '2026-01-14 20:16:00', 1),
(375, 1, NULL, NULL, '2026-01-14 20:31:00', 1),
(376, 1, NULL, NULL, '2026-01-14 10:00:00', 1),
(377, 1, NULL, NULL, '2026-01-14 10:15:00', 1),
(378, 1, NULL, NULL, '2026-01-14 10:30:00', 1),
(379, 1, NULL, NULL, '2026-01-14 10:45:00', 1),
(380, 1, NULL, NULL, '2026-01-14 11:00:00', 1),
(381, 1, NULL, NULL, '2026-01-14 11:15:00', 1),
(382, 1, NULL, NULL, '2026-01-14 11:30:00', 1),
(383, 1, NULL, NULL, '2026-01-14 11:45:00', 1),
(384, 5, NULL, NULL, '2026-01-14 16:51:00', 1),
(385, 5, NULL, NULL, '2026-01-14 17:06:00', 1),
(386, 5, NULL, NULL, '2026-01-14 17:21:00', 1),
(387, 5, NULL, NULL, '2026-01-14 17:36:00', 1),
(388, 5, NULL, NULL, '2026-01-14 17:51:00', 1),
(389, 5, NULL, NULL, '2026-01-14 18:06:00', 1),
(390, 5, NULL, NULL, '2026-01-14 18:21:00', 1),
(391, 5, NULL, NULL, '2026-01-14 18:36:00', 1),
(392, 5, NULL, NULL, '2026-01-14 18:51:00', 1),
(393, 5, NULL, NULL, '2026-01-14 19:06:00', 1),
(394, 5, NULL, NULL, '2026-01-14 19:21:00', 1),
(395, 5, NULL, NULL, '2026-01-14 19:36:00', 1),
(396, 5, NULL, NULL, '2026-01-14 19:51:00', 1),
(397, 5, NULL, NULL, '2026-01-14 20:06:00', 1),
(398, 5, NULL, NULL, '2026-01-14 20:21:00', 1),
(399, 5, NULL, NULL, '2026-01-14 20:36:00', 1),
(400, 5, NULL, NULL, '2026-01-14 20:51:00', 1),
(401, 1, NULL, NULL, '2026-01-15 08:30:00', 1),
(402, 1, NULL, NULL, '2026-01-15 08:45:00', 1),
(403, 1, NULL, NULL, '2026-01-15 09:00:00', 1),
(404, 1, NULL, NULL, '2026-01-15 09:15:00', 1),
(405, 1, NULL, NULL, '2026-01-15 09:30:00', 1),
(406, 1, NULL, NULL, '2026-01-15 09:45:00', 1),
(407, 1, NULL, NULL, '2026-01-15 10:00:00', 1),
(408, 1, NULL, NULL, '2026-01-15 10:15:00', 1),
(409, 1, NULL, NULL, '2026-01-15 10:30:00', 1),
(410, 1, NULL, NULL, '2026-01-15 10:45:00', 1),
(411, 1, NULL, NULL, '2026-01-15 11:00:00', 1),
(412, 1, NULL, NULL, '2026-01-15 11:15:00', 1),
(413, 1, NULL, NULL, '2026-01-15 11:30:00', 1),
(414, 1, NULL, NULL, '2026-01-15 11:45:00', 1),
(415, 1, NULL, NULL, '2026-01-15 12:00:00', 1),
(416, 1, NULL, NULL, '2026-01-15 12:15:00', 1),
(417, 1, NULL, NULL, '2026-02-05 08:30:00', 1),
(418, 1, NULL, NULL, '2026-02-05 08:45:00', 1),
(419, 1, 7, 1, '2026-02-05 09:00:00', 3),
(420, 1, 7, 1, '2026-02-05 09:15:00', 2),
(421, 1, NULL, NULL, '2026-02-05 09:30:00', 1),
(422, 1, NULL, NULL, '2026-02-05 09:45:00', 1),
(423, 1, NULL, NULL, '2026-02-05 10:00:00', 1),
(424, 1, NULL, NULL, '2026-02-05 10:15:00', 1),
(425, 1, NULL, NULL, '2026-02-05 10:30:00', 1),
(426, 1, NULL, NULL, '2026-02-05 10:45:00', 1),
(427, 1, NULL, NULL, '2026-02-05 11:00:00', 1),
(428, 1, NULL, NULL, '2026-02-05 11:15:00', 1),
(429, 1, 7, 2, '2026-02-05 11:30:00', 3),
(430, 1, NULL, NULL, '2026-02-05 11:45:00', 1),
(431, 1, NULL, NULL, '2026-02-05 12:00:00', 1),
(432, 1, NULL, NULL, '2026-02-05 12:15:00', 1),
(433, 1, 7, 3, '2026-02-06 16:30:00', 3),
(434, 1, NULL, NULL, '2026-02-06 16:45:00', 1),
(435, 1, NULL, NULL, '2026-02-06 17:00:00', 1),
(436, 1, 7, 1, '2026-02-06 17:15:00', 2),
(437, 1, NULL, NULL, '2026-02-06 17:30:00', 1),
(438, 1, NULL, NULL, '2026-02-06 17:45:00', 1),
(439, 1, NULL, NULL, '2026-02-06 18:00:00', 1),
(440, 1, NULL, NULL, '2026-02-06 18:15:00', 1),
(441, 1, NULL, NULL, '2026-02-06 18:30:00', 1),
(442, 1, NULL, NULL, '2026-02-06 18:45:00', 1),
(443, 1, NULL, NULL, '2026-02-06 19:00:00', 1),
(444, 1, NULL, NULL, '2026-02-06 19:15:00', 1),
(445, 1, NULL, NULL, '2026-02-06 19:30:00', 1),
(446, 1, NULL, NULL, '2026-02-06 19:45:00', 1),
(447, 1, NULL, NULL, '2026-02-06 20:00:00', 1),
(448, 1, NULL, NULL, '2026-02-06 20:15:00', 1),
(449, 1, NULL, NULL, '2026-02-07 08:30:00', 1),
(450, 1, 7, 1, '2026-02-07 08:45:00', 2),
(451, 1, NULL, NULL, '2026-02-07 09:00:00', 1),
(452, 1, NULL, NULL, '2026-02-07 09:15:00', 1),
(453, 1, NULL, NULL, '2026-02-07 09:30:00', 1),
(454, 1, NULL, NULL, '2026-02-07 09:45:00', 1),
(455, 1, NULL, NULL, '2026-02-07 10:00:00', 1),
(456, 1, NULL, NULL, '2026-02-07 10:15:00', 1),
(457, 1, NULL, NULL, '2026-02-09 06:00:00', 1),
(458, 1, NULL, NULL, '2026-02-09 06:15:00', 1),
(459, 1, NULL, NULL, '2026-02-09 06:30:00', 1),
(460, 1, NULL, NULL, '2026-02-09 06:45:00', 1),
(461, 1, NULL, NULL, '2026-02-09 07:00:00', 1),
(462, 1, NULL, NULL, '2026-02-09 07:15:00', 1),
(463, 1, NULL, NULL, '2026-02-09 07:30:00', 1),
(464, 1, NULL, NULL, '2026-02-09 07:45:00', 1),
(465, 1, NULL, NULL, '2026-02-09 08:00:00', 1),
(466, 1, NULL, NULL, '2026-02-09 08:15:00', 1),
(467, 1, NULL, NULL, '2026-02-09 08:30:00', 1),
(468, 1, NULL, NULL, '2026-02-09 08:45:00', 1),
(469, 1, NULL, NULL, '2026-02-09 09:00:00', 1),
(470, 1, NULL, NULL, '2026-02-09 09:15:00', 1),
(471, 1, NULL, NULL, '2026-02-09 09:30:00', 1),
(472, 1, NULL, NULL, '2026-02-09 09:45:00', 1),
(473, 1, NULL, NULL, '2026-02-09 10:00:00', 1),
(474, 1, NULL, NULL, '2026-02-09 10:15:00', 1),
(475, 1, NULL, NULL, '2026-02-09 10:30:00', 1),
(476, 1, NULL, NULL, '2026-02-09 10:45:00', 1),
(477, 1, NULL, NULL, '2026-02-09 11:00:00', 1),
(478, 1, NULL, NULL, '2026-02-09 11:15:00', 1),
(479, 1, NULL, NULL, '2026-02-09 11:30:00', 1),
(480, 1, NULL, NULL, '2026-02-09 11:45:00', 1),
(481, 1, NULL, NULL, '2026-02-09 12:00:00', 1),
(482, 1, NULL, NULL, '2026-02-09 12:15:00', 1),
(483, 1, NULL, NULL, '2026-02-09 12:30:00', 1),
(484, 1, NULL, NULL, '2026-02-09 12:45:00', 1),
(485, 1, NULL, NULL, '2026-02-09 13:00:00', 1),
(486, 1, NULL, NULL, '2026-02-09 13:15:00', 1),
(487, 1, NULL, NULL, '2026-02-09 13:30:00', 1),
(488, 1, NULL, NULL, '2026-02-09 13:45:00', 1),
(489, 1, NULL, NULL, '2026-02-09 14:00:00', 1),
(490, 1, NULL, NULL, '2026-02-09 14:15:00', 1),
(491, 1, NULL, NULL, '2026-02-09 14:30:00', 1),
(492, 1, NULL, NULL, '2026-02-09 14:45:00', 1),
(493, 1, NULL, NULL, '2026-02-09 16:39:00', 1),
(494, 1, NULL, NULL, '2026-02-09 16:54:00', 1),
(495, 1, NULL, NULL, '2026-02-09 17:09:00', 1),
(496, 1, NULL, NULL, '2026-02-09 17:24:00', 1),
(497, 1, NULL, NULL, '2026-02-09 17:39:00', 1),
(498, 1, NULL, NULL, '2026-02-09 17:54:00', 1),
(499, 1, NULL, NULL, '2026-02-09 18:09:00', 1),
(500, 1, NULL, NULL, '2026-02-09 18:24:00', 1),
(501, 1, NULL, NULL, '2026-02-09 18:39:00', 1),
(502, 1, NULL, NULL, '2026-02-09 18:54:00', 1),
(503, 1, NULL, NULL, '2026-02-09 19:09:00', 1),
(504, 1, NULL, NULL, '2026-02-09 19:24:00', 1),
(505, 1, NULL, NULL, '2026-02-09 19:39:00', 1),
(506, 1, NULL, NULL, '2026-02-09 19:54:00', 1),
(507, 1, NULL, NULL, '2026-02-09 20:09:00', 1),
(508, 1, NULL, NULL, '2026-02-09 20:24:00', 1),
(509, 1, NULL, NULL, '2026-02-09 20:39:00', 1),
(510, 1, NULL, NULL, '2026-02-09 20:54:00', 1),
(511, 1, NULL, NULL, '2026-02-09 21:09:00', 1),
(512, 1, NULL, NULL, '2026-02-09 21:24:00', 1),
(513, 5, NULL, NULL, '2026-02-09 16:51:00', 1),
(514, 5, NULL, NULL, '2026-02-09 17:06:00', 1),
(515, 5, NULL, NULL, '2026-02-09 17:21:00', 1),
(516, 5, NULL, NULL, '2026-02-09 17:36:00', 1),
(517, 5, 8, NULL, '2026-02-09 17:51:00', 2),
(518, 5, NULL, NULL, '2026-02-09 18:06:00', 1),
(519, 5, NULL, NULL, '2026-02-09 18:21:00', 1),
(520, 5, NULL, NULL, '2026-02-09 18:36:00', 1),
(521, 5, NULL, NULL, '2026-02-09 18:51:00', 1),
(522, 5, NULL, NULL, '2026-02-09 19:06:00', 1),
(523, 5, NULL, NULL, '2026-02-09 19:21:00', 1),
(524, 5, NULL, NULL, '2026-02-09 19:36:00', 1),
(525, 5, NULL, NULL, '2026-02-09 19:51:00', 1),
(526, 5, NULL, NULL, '2026-02-09 20:06:00', 1),
(527, 5, NULL, NULL, '2026-02-09 20:21:00', 1),
(528, 5, NULL, NULL, '2026-02-09 20:36:00', 1),
(529, 5, NULL, NULL, '2026-02-09 20:51:00', 1),
(530, 1, NULL, NULL, '2026-02-10 10:00:00', 1),
(531, 1, NULL, NULL, '2026-02-10 10:15:00', 1),
(532, 1, NULL, NULL, '2026-02-10 10:30:00', 1),
(533, 1, NULL, NULL, '2026-02-10 10:45:00', 1),
(534, 1, NULL, NULL, '2026-02-10 11:00:00', 1),
(535, 1, NULL, NULL, '2026-02-10 11:15:00', 1),
(536, 1, NULL, NULL, '2026-02-10 11:30:00', 1),
(537, 1, NULL, NULL, '2026-02-10 11:45:00', 1),
(538, 1, NULL, NULL, '2026-02-11 16:31:00', 1),
(539, 1, NULL, NULL, '2026-02-11 16:46:00', 1),
(540, 1, NULL, NULL, '2026-02-11 17:01:00', 1),
(541, 1, NULL, NULL, '2026-02-11 17:16:00', 1),
(542, 1, NULL, NULL, '2026-02-11 17:31:00', 1),
(543, 1, NULL, NULL, '2026-02-11 17:46:00', 1),
(544, 1, NULL, NULL, '2026-02-11 18:01:00', 1),
(545, 1, NULL, NULL, '2026-02-11 18:16:00', 1),
(546, 1, NULL, NULL, '2026-02-11 18:31:00', 1),
(547, 1, NULL, NULL, '2026-02-11 18:46:00', 1),
(548, 1, NULL, NULL, '2026-02-11 19:01:00', 1),
(549, 1, NULL, NULL, '2026-02-11 19:16:00', 1),
(550, 1, NULL, NULL, '2026-02-11 19:31:00', 1),
(551, 1, NULL, NULL, '2026-02-11 19:46:00', 1),
(552, 1, NULL, NULL, '2026-02-11 20:01:00', 1),
(553, 1, NULL, NULL, '2026-02-11 20:16:00', 1),
(554, 1, NULL, NULL, '2026-02-11 20:31:00', 1),
(555, 1, NULL, NULL, '2026-02-11 10:00:00', 1),
(556, 1, NULL, NULL, '2026-02-11 10:15:00', 1),
(557, 1, NULL, NULL, '2026-02-11 10:30:00', 1),
(558, 1, NULL, NULL, '2026-02-11 10:45:00', 1),
(559, 1, NULL, NULL, '2026-02-11 11:00:00', 1),
(560, 1, NULL, NULL, '2026-02-11 11:15:00', 1),
(561, 1, NULL, NULL, '2026-02-11 11:30:00', 1),
(562, 1, NULL, NULL, '2026-02-11 11:45:00', 1),
(563, 5, NULL, NULL, '2026-02-11 16:51:00', 1),
(564, 5, NULL, NULL, '2026-02-11 17:06:00', 1),
(565, 5, NULL, NULL, '2026-02-11 17:21:00', 1),
(566, 5, NULL, NULL, '2026-02-11 17:36:00', 1),
(567, 5, NULL, NULL, '2026-02-11 17:51:00', 1),
(568, 5, NULL, NULL, '2026-02-11 18:06:00', 1),
(569, 5, NULL, NULL, '2026-02-11 18:21:00', 1),
(570, 5, NULL, NULL, '2026-02-11 18:36:00', 1),
(571, 5, NULL, NULL, '2026-02-11 18:51:00', 1),
(572, 5, NULL, NULL, '2026-02-11 19:06:00', 1),
(573, 5, NULL, NULL, '2026-02-11 19:21:00', 1),
(574, 5, NULL, NULL, '2026-02-11 19:36:00', 1),
(575, 5, NULL, NULL, '2026-02-11 19:51:00', 1),
(576, 5, NULL, NULL, '2026-02-11 20:06:00', 1),
(577, 5, NULL, NULL, '2026-02-11 20:21:00', 1),
(578, 5, NULL, NULL, '2026-02-11 20:36:00', 1),
(579, 5, NULL, NULL, '2026-02-11 20:51:00', 1),
(580, 1, NULL, NULL, '2026-02-11 19:28:00', 1),
(581, 1, NULL, NULL, '2026-02-11 19:43:00', 1),
(582, 1, NULL, NULL, '2026-02-11 19:58:00', 1),
(583, 1, NULL, NULL, '2026-02-11 20:13:00', 1),
(584, 1, NULL, NULL, '2026-02-11 20:28:00', 1),
(585, 1, NULL, NULL, '2026-02-11 20:43:00', 1),
(586, 1, NULL, NULL, '2026-02-11 20:58:00', 1),
(587, 1, NULL, NULL, '2026-02-11 21:13:00', 1),
(588, 1, NULL, NULL, '2026-02-11 21:28:00', 1),
(589, 1, NULL, NULL, '2026-02-11 21:43:00', 1),
(590, 1, NULL, NULL, '2026-02-11 21:58:00', 1),
(591, 1, NULL, NULL, '2026-02-11 22:13:00', 1),
(592, 1, NULL, NULL, '2026-02-11 22:28:00', 1),
(593, 1, NULL, NULL, '2026-02-12 08:30:00', 1),
(594, 1, NULL, NULL, '2026-02-12 08:45:00', 1),
(595, 1, NULL, NULL, '2026-02-12 09:00:00', 1),
(596, 1, NULL, NULL, '2026-02-12 09:15:00', 1),
(597, 1, NULL, NULL, '2026-02-12 09:30:00', 1),
(598, 1, NULL, NULL, '2026-02-12 09:45:00', 1),
(599, 1, NULL, NULL, '2026-02-12 10:00:00', 1),
(600, 1, NULL, NULL, '2026-02-12 10:15:00', 1),
(601, 1, NULL, NULL, '2026-02-12 10:30:00', 1),
(602, 1, NULL, NULL, '2026-02-12 10:45:00', 1),
(603, 1, NULL, NULL, '2026-02-12 11:00:00', 1),
(604, 1, NULL, NULL, '2026-02-12 11:15:00', 1),
(605, 1, NULL, NULL, '2026-02-12 11:30:00', 1),
(606, 1, NULL, NULL, '2026-02-12 11:45:00', 1),
(607, 1, NULL, NULL, '2026-02-12 12:00:00', 1),
(608, 1, NULL, NULL, '2026-02-12 12:15:00', 1),
(609, 1, NULL, NULL, '2026-02-13 16:30:00', 1),
(610, 1, NULL, NULL, '2026-02-13 16:45:00', 1),
(611, 1, NULL, NULL, '2026-02-13 17:00:00', 1),
(612, 1, NULL, NULL, '2026-02-13 17:15:00', 1),
(613, 1, NULL, NULL, '2026-02-13 17:30:00', 1),
(614, 1, NULL, NULL, '2026-02-13 17:45:00', 1),
(615, 1, NULL, NULL, '2026-02-13 18:00:00', 1),
(616, 1, NULL, NULL, '2026-02-13 18:15:00', 1),
(617, 1, NULL, NULL, '2026-02-13 18:30:00', 1),
(618, 1, NULL, NULL, '2026-02-13 18:45:00', 1),
(619, 1, NULL, NULL, '2026-02-13 19:00:00', 1),
(620, 1, NULL, NULL, '2026-02-13 19:15:00', 1),
(621, 1, NULL, NULL, '2026-02-13 19:30:00', 1),
(622, 1, NULL, NULL, '2026-02-13 19:45:00', 1),
(623, 1, NULL, NULL, '2026-02-13 20:00:00', 1),
(624, 1, NULL, NULL, '2026-02-13 20:15:00', 1),
(625, 1, NULL, NULL, '2026-02-14 08:30:00', 1),
(626, 1, NULL, NULL, '2026-02-14 08:45:00', 1),
(627, 1, NULL, NULL, '2026-02-14 09:00:00', 1),
(628, 1, NULL, NULL, '2026-02-14 09:15:00', 1),
(629, 1, NULL, NULL, '2026-02-14 09:30:00', 1),
(630, 1, NULL, NULL, '2026-02-14 09:45:00', 1),
(631, 1, NULL, NULL, '2026-02-14 10:00:00', 1),
(632, 1, NULL, NULL, '2026-02-14 10:15:00', 1),
(633, 1, NULL, NULL, '2026-02-16 06:00:00', 1),
(634, 1, NULL, NULL, '2026-02-16 06:15:00', 1),
(635, 1, NULL, NULL, '2026-02-16 06:30:00', 1),
(636, 1, NULL, NULL, '2026-02-16 06:45:00', 1),
(637, 1, NULL, NULL, '2026-02-16 07:00:00', 1),
(638, 1, NULL, NULL, '2026-02-16 07:15:00', 1),
(639, 1, NULL, NULL, '2026-02-16 07:30:00', 1),
(640, 1, NULL, NULL, '2026-02-16 07:45:00', 1),
(641, 1, NULL, NULL, '2026-02-16 08:00:00', 1),
(642, 1, NULL, NULL, '2026-02-16 08:15:00', 1),
(643, 1, NULL, NULL, '2026-02-16 08:30:00', 1),
(644, 1, NULL, NULL, '2026-02-16 08:45:00', 1),
(645, 1, NULL, NULL, '2026-02-16 09:00:00', 1),
(646, 1, NULL, NULL, '2026-02-16 09:15:00', 1),
(647, 1, NULL, NULL, '2026-02-16 09:30:00', 1),
(648, 1, NULL, NULL, '2026-02-16 09:45:00', 1),
(649, 1, NULL, NULL, '2026-02-16 10:00:00', 1),
(650, 1, NULL, NULL, '2026-02-16 10:15:00', 1),
(651, 1, NULL, NULL, '2026-02-16 10:30:00', 1),
(652, 1, NULL, NULL, '2026-02-16 10:45:00', 1),
(653, 1, NULL, NULL, '2026-02-16 11:00:00', 1),
(654, 1, NULL, NULL, '2026-02-16 11:15:00', 1),
(655, 1, NULL, NULL, '2026-02-16 11:30:00', 1),
(656, 1, NULL, NULL, '2026-02-16 11:45:00', 1),
(657, 1, NULL, NULL, '2026-02-16 12:00:00', 1),
(658, 1, NULL, NULL, '2026-02-16 12:15:00', 1),
(659, 1, NULL, NULL, '2026-02-16 12:30:00', 1),
(660, 1, NULL, NULL, '2026-02-16 12:45:00', 1),
(661, 1, NULL, NULL, '2026-02-16 13:00:00', 1),
(662, 1, NULL, NULL, '2026-02-16 13:15:00', 1),
(663, 1, NULL, NULL, '2026-02-16 13:30:00', 1),
(664, 1, NULL, NULL, '2026-02-16 13:45:00', 1),
(665, 1, NULL, NULL, '2026-02-16 14:00:00', 1),
(666, 1, NULL, NULL, '2026-02-16 14:15:00', 1),
(667, 1, NULL, NULL, '2026-02-16 14:30:00', 1),
(668, 1, NULL, NULL, '2026-02-16 14:45:00', 1),
(669, 1, NULL, NULL, '2026-02-16 16:39:00', 1),
(670, 1, NULL, NULL, '2026-02-16 16:54:00', 1),
(671, 1, NULL, NULL, '2026-02-16 17:09:00', 1),
(672, 1, NULL, NULL, '2026-02-16 17:24:00', 1),
(673, 1, NULL, NULL, '2026-02-16 17:39:00', 1),
(674, 1, NULL, NULL, '2026-02-16 17:54:00', 1),
(675, 1, NULL, NULL, '2026-02-16 18:09:00', 1),
(676, 1, NULL, NULL, '2026-02-16 18:24:00', 1),
(677, 1, NULL, NULL, '2026-02-16 18:39:00', 1),
(678, 1, NULL, NULL, '2026-02-16 18:54:00', 1),
(679, 1, NULL, NULL, '2026-02-16 19:09:00', 1),
(680, 1, NULL, NULL, '2026-02-16 19:24:00', 1),
(681, 1, NULL, NULL, '2026-02-16 19:39:00', 1),
(682, 1, NULL, NULL, '2026-02-16 19:54:00', 1),
(683, 1, NULL, NULL, '2026-02-16 20:09:00', 1),
(684, 1, NULL, NULL, '2026-02-16 20:24:00', 1),
(685, 1, NULL, NULL, '2026-02-16 20:39:00', 1),
(686, 1, NULL, NULL, '2026-02-16 20:54:00', 1),
(687, 1, NULL, NULL, '2026-02-16 21:09:00', 1),
(688, 1, NULL, NULL, '2026-02-16 21:24:00', 1),
(689, 5, NULL, NULL, '2026-02-16 16:51:00', 1),
(690, 5, NULL, NULL, '2026-02-16 17:06:00', 1),
(691, 5, NULL, NULL, '2026-02-16 17:21:00', 1),
(692, 5, NULL, NULL, '2026-02-16 17:36:00', 1),
(693, 5, NULL, NULL, '2026-02-16 17:51:00', 1),
(694, 5, NULL, NULL, '2026-02-16 18:06:00', 1),
(695, 5, NULL, NULL, '2026-02-16 18:21:00', 1),
(696, 5, NULL, NULL, '2026-02-16 18:36:00', 1),
(697, 5, NULL, NULL, '2026-02-16 18:51:00', 1),
(698, 5, NULL, NULL, '2026-02-16 19:06:00', 1),
(699, 5, NULL, NULL, '2026-02-16 19:21:00', 1),
(700, 5, NULL, NULL, '2026-02-16 19:36:00', 1),
(701, 5, NULL, NULL, '2026-02-16 19:51:00', 1),
(702, 5, NULL, NULL, '2026-02-16 20:06:00', 1),
(703, 5, NULL, NULL, '2026-02-16 20:21:00', 1),
(704, 5, NULL, NULL, '2026-02-16 20:36:00', 1),
(705, 5, NULL, NULL, '2026-02-16 20:51:00', 1),
(706, 1, NULL, NULL, '2026-02-17 10:00:00', 1),
(707, 1, NULL, NULL, '2026-02-17 10:15:00', 1),
(708, 1, NULL, NULL, '2026-02-17 10:30:00', 1),
(709, 1, NULL, NULL, '2026-02-17 10:45:00', 1),
(710, 1, NULL, NULL, '2026-02-17 11:00:00', 1),
(711, 1, NULL, NULL, '2026-02-17 11:15:00', 1),
(712, 1, NULL, NULL, '2026-02-17 11:30:00', 1),
(713, 1, NULL, NULL, '2026-02-17 11:45:00', 1),
(714, 1, NULL, NULL, '2026-02-18 16:31:00', 1),
(715, 1, NULL, NULL, '2026-02-18 16:46:00', 1),
(716, 1, NULL, NULL, '2026-02-18 17:01:00', 1),
(717, 1, NULL, NULL, '2026-02-18 17:16:00', 1),
(718, 1, NULL, NULL, '2026-02-18 17:31:00', 1),
(719, 1, NULL, NULL, '2026-02-18 17:46:00', 1),
(720, 1, NULL, NULL, '2026-02-18 18:01:00', 1),
(721, 1, NULL, NULL, '2026-02-18 18:16:00', 1),
(722, 1, NULL, NULL, '2026-02-18 18:31:00', 1),
(723, 1, NULL, NULL, '2026-02-18 18:46:00', 1),
(724, 1, NULL, NULL, '2026-02-18 19:01:00', 1),
(725, 1, NULL, NULL, '2026-02-18 19:16:00', 1),
(726, 1, NULL, NULL, '2026-02-18 19:31:00', 1),
(727, 1, NULL, NULL, '2026-02-18 19:46:00', 1),
(728, 1, NULL, NULL, '2026-02-18 20:01:00', 1),
(729, 1, NULL, NULL, '2026-02-18 20:16:00', 1),
(730, 1, NULL, NULL, '2026-02-18 20:31:00', 1),
(731, 1, NULL, NULL, '2026-02-18 10:00:00', 1),
(732, 1, NULL, NULL, '2026-02-18 10:15:00', 1),
(733, 1, NULL, NULL, '2026-02-18 10:30:00', 1),
(734, 1, NULL, NULL, '2026-02-18 10:45:00', 1),
(735, 1, NULL, NULL, '2026-02-18 11:00:00', 1),
(736, 1, NULL, NULL, '2026-02-18 11:15:00', 1),
(737, 1, NULL, NULL, '2026-02-18 11:30:00', 1),
(738, 1, NULL, NULL, '2026-02-18 11:45:00', 1),
(739, 5, NULL, NULL, '2026-02-18 16:51:00', 1),
(740, 5, NULL, NULL, '2026-02-18 17:06:00', 1),
(741, 5, NULL, NULL, '2026-02-18 17:21:00', 1),
(742, 5, NULL, NULL, '2026-02-18 17:36:00', 1),
(743, 5, NULL, NULL, '2026-02-18 17:51:00', 1),
(744, 5, NULL, NULL, '2026-02-18 18:06:00', 1),
(745, 5, NULL, NULL, '2026-02-18 18:21:00', 1),
(746, 5, NULL, NULL, '2026-02-18 18:36:00', 1),
(747, 5, NULL, NULL, '2026-02-18 18:51:00', 1),
(748, 5, NULL, NULL, '2026-02-18 19:06:00', 1),
(749, 5, NULL, NULL, '2026-02-18 19:21:00', 1),
(750, 5, NULL, NULL, '2026-02-18 19:36:00', 1),
(751, 5, NULL, NULL, '2026-02-18 19:51:00', 1),
(752, 5, NULL, NULL, '2026-02-18 20:06:00', 1),
(753, 5, NULL, NULL, '2026-02-18 20:21:00', 1),
(754, 5, NULL, NULL, '2026-02-18 20:36:00', 1),
(755, 5, NULL, NULL, '2026-02-18 20:51:00', 1),
(756, 1, NULL, NULL, '2026-02-18 19:28:00', 1),
(757, 1, NULL, NULL, '2026-02-18 19:43:00', 1),
(758, 1, NULL, NULL, '2026-02-18 19:58:00', 1),
(759, 1, NULL, NULL, '2026-02-18 20:13:00', 1),
(760, 1, NULL, NULL, '2026-02-18 20:28:00', 1),
(761, 1, NULL, NULL, '2026-02-18 20:43:00', 1),
(762, 1, NULL, NULL, '2026-02-18 20:58:00', 1),
(763, 1, NULL, NULL, '2026-02-18 21:13:00', 1),
(764, 1, NULL, NULL, '2026-02-18 21:28:00', 1),
(765, 1, NULL, NULL, '2026-02-18 21:43:00', 1),
(766, 1, NULL, NULL, '2026-02-18 21:58:00', 1),
(767, 1, NULL, NULL, '2026-02-18 22:13:00', 1),
(768, 1, NULL, NULL, '2026-02-18 22:28:00', 1),
(769, 1, NULL, NULL, '2026-02-19 08:30:00', 1),
(770, 1, NULL, NULL, '2026-02-19 08:45:00', 1),
(771, 1, NULL, NULL, '2026-02-19 09:00:00', 1),
(772, 1, NULL, NULL, '2026-02-19 09:15:00', 1),
(773, 1, NULL, NULL, '2026-02-19 09:30:00', 1),
(774, 1, NULL, NULL, '2026-02-19 09:45:00', 1),
(775, 1, NULL, NULL, '2026-02-19 10:00:00', 1),
(776, 1, NULL, NULL, '2026-02-19 10:15:00', 1),
(777, 1, NULL, NULL, '2026-02-19 10:30:00', 1),
(778, 1, NULL, NULL, '2026-02-19 10:45:00', 1),
(779, 1, NULL, NULL, '2026-02-19 11:00:00', 1),
(780, 1, NULL, NULL, '2026-02-19 11:15:00', 1),
(781, 1, NULL, NULL, '2026-02-19 11:30:00', 1),
(782, 1, NULL, NULL, '2026-02-19 11:45:00', 1),
(783, 1, NULL, NULL, '2026-02-19 12:00:00', 1),
(784, 1, NULL, NULL, '2026-02-19 12:15:00', 1),
(785, 1, 7, 1, '2026-02-04 12:34:00', 3),
(786, 1, 7, 1, '2026-02-04 12:35:00', 3),
(787, 1, 7, 2, '2026-02-05 10:00:00', 3),
(788, 1, 7, 1, '2026-02-05 10:45:00', 3),
(789, 1, NULL, NULL, '2026-02-04 16:31:00', 1),
(790, 1, NULL, NULL, '2026-02-04 16:46:00', 1),
(791, 1, NULL, NULL, '2026-02-04 17:01:00', 1),
(792, 1, NULL, NULL, '2026-02-04 17:16:00', 1),
(793, 1, NULL, NULL, '2026-02-04 17:31:00', 1),
(794, 1, NULL, NULL, '2026-02-04 17:46:00', 1),
(795, 1, NULL, NULL, '2026-02-04 18:01:00', 1),
(796, 1, NULL, NULL, '2026-02-04 18:16:00', 1),
(797, 1, NULL, NULL, '2026-02-04 18:31:00', 1),
(798, 1, NULL, NULL, '2026-02-04 18:46:00', 1),
(799, 1, NULL, NULL, '2026-02-04 19:01:00', 1),
(800, 1, NULL, NULL, '2026-02-04 19:16:00', 1),
(801, 1, NULL, NULL, '2026-02-04 19:31:00', 1),
(802, 1, NULL, NULL, '2026-02-04 19:46:00', 1),
(803, 1, NULL, NULL, '2026-02-04 20:01:00', 1),
(804, 1, NULL, NULL, '2026-02-04 20:16:00', 1),
(805, 1, NULL, NULL, '2026-02-04 20:31:00', 1),
(806, 1, NULL, NULL, '2026-02-04 10:00:00', 1),
(807, 1, NULL, NULL, '2026-02-04 10:15:00', 1),
(808, 1, NULL, NULL, '2026-02-04 10:30:00', 1),
(809, 1, NULL, NULL, '2026-02-04 10:45:00', 1),
(810, 1, NULL, NULL, '2026-02-04 11:00:00', 1),
(811, 1, NULL, NULL, '2026-02-04 11:15:00', 1),
(812, 1, NULL, NULL, '2026-02-04 11:30:00', 1),
(813, 1, NULL, NULL, '2026-02-04 11:45:00', 1),
(814, 5, NULL, NULL, '2026-02-04 16:51:00', 1),
(815, 5, NULL, NULL, '2026-02-04 17:06:00', 1),
(816, 5, NULL, NULL, '2026-02-04 17:21:00', 1),
(817, 5, NULL, NULL, '2026-02-04 17:36:00', 1),
(818, 5, NULL, NULL, '2026-02-04 17:51:00', 1),
(819, 5, NULL, NULL, '2026-02-04 18:06:00', 1),
(820, 5, NULL, NULL, '2026-02-04 18:21:00', 1),
(821, 5, NULL, NULL, '2026-02-04 18:36:00', 1),
(822, 5, NULL, NULL, '2026-02-04 18:51:00', 1),
(823, 5, NULL, NULL, '2026-02-04 19:06:00', 1),
(824, 5, NULL, NULL, '2026-02-04 19:21:00', 1),
(825, 5, NULL, NULL, '2026-02-04 19:36:00', 1),
(826, 5, NULL, NULL, '2026-02-04 19:51:00', 1),
(827, 5, NULL, NULL, '2026-02-04 20:06:00', 1),
(828, 5, NULL, NULL, '2026-02-04 20:21:00', 1),
(829, 5, NULL, NULL, '2026-02-04 20:36:00', 1),
(830, 5, NULL, NULL, '2026-02-04 20:51:00', 1),
(831, 1, NULL, NULL, '2026-02-04 19:28:00', 1),
(832, 1, NULL, NULL, '2026-02-04 19:43:00', 1),
(833, 1, NULL, NULL, '2026-02-04 19:58:00', 1),
(834, 1, NULL, NULL, '2026-02-04 20:13:00', 1),
(835, 1, NULL, NULL, '2026-02-04 20:28:00', 1),
(836, 1, 7, 1, '2026-02-04 20:43:00', 2),
(837, 1, NULL, NULL, '2026-02-04 20:58:00', 1),
(838, 1, NULL, NULL, '2026-02-04 21:13:00', 1),
(839, 1, NULL, NULL, '2026-02-04 21:28:00', 1),
(840, 1, NULL, NULL, '2026-02-04 21:43:00', 1),
(841, 1, NULL, NULL, '2026-02-04 21:58:00', 1),
(842, 1, NULL, NULL, '2026-02-04 22:13:00', 1),
(843, 1, NULL, NULL, '2026-02-04 22:28:00', 1);

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
  `id_categoriaUsuario` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `id_categoriaUsuario`, `id_paciente`) VALUES
(8, 'Esteban Mazzaro', 'estebanmazzaro@gmail.com', '$2b$10$WqKXdbPui1z7BlR4wzinfefV6vcKb/g3o1mXi6iPIiCXwfPEGIhY6', 2, NULL),
(10, 'Mariano Mengide', 'mariano@gmail.com', '$2b$10$1oLjouMCVdiC5HS8ubhq1u3Jb1vnlank14nv1DDS42bI7FL/2l/hq', 2, NULL),
(12, 'Camila Pérez', 'camilamazzaro@yahoo.com.mx', '$2b$10$yz8cXbAsoNbKvfSEuWmtJ.Gcm0f4bkt/A2rp4Ha4kzeaKYX9Iju8W', 1, NULL),
(16, 'Camila Mazzaro', 'camilamazzaro90@gmail.com', '$2b$10$poiRZBDSWHFznudc2KtEAuH8h2Z/x96CPDBKcPw93L6YDEfDh0fCW', 4, 7),
(19, 'Camila Mazzaro', 'camimazzari11@gmail.com', '$2b$10$2dO1Ro9/etEbx62zPWfthOUrvHLlmt2YOpABG5DJkA7FpxwhPaojK', 3, NULL),
(20, 'Raúl Fescina', 'raulfescina@gmail.com', '$2b$10$Dr0axCevdxOBAStWXr1XcejwUcKh6Aj4g.z27bqVOqctU1TJE4Wf.', 2, NULL);

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
(3, 'Secretaria'),
(4, 'Paciente');

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
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_medico` (`id_medico`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `practicas`
--
ALTER TABLE `practicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=844;

--
-- AUTO_INCREMENT de la tabla `turno_estados`
--
ALTER TABLE `turno_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuario_categorias`
--
ALTER TABLE `usuario_categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recetas_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
