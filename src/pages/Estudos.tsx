import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
  Search,
  ChevronRight,
  MessageCircleQuestion,
  SquareArrowRight,
  Settings,
  LibraryBig,
  Menu,
  Plus,
  CircleAlert,
  Play,
  Pause,
  BookOpen,
  Timer,
  Clock4,
  RotateCcw,
} from 'lucide-react';

function Estudos() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  const [darkMode, setDarkMode] = useState(false);

  const [tempo, setTempo] = useState('00:00:00');
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    let intervalo: any;

    if (timerAtivo) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [timerAtivo]);

  useEffect(() => {
    const hrs = String(Math.floor(segundos / 3600)).padStart(2, '0');
    const mins = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
    const secs = String(segundos % 60).padStart(2, '0');
    setTempo(`${hrs}:${mins}:${secs}`);
  }, [segundos]);

  const iniciarTimer = () => setTimerAtivo(true);
  const pararTimer = () => setTimerAtivo(false);
  const resetarTimer = () => {
    pararTimer();
    setSegundos(0);
  };

  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const horarios = Array.from({ length: 17 }, (_, i) => `${7 + i}:00`);

  const [cronograma, setCronograma] = useState(
    Array.from({ length: 17 }, () => Array(7).fill({ titulo: '', cor: '' })),
  );

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [materias, setMaterias] = useState<
    { nome: string; cor: string; dia: string; hora: string }[]
  >([]);

  const [materiaSelecionada, setMateriaSelecionada] = useState<{
    nome: string;
    cor: string;
    totalHoras: number;
  } | null>(null);

  const handleSalvarMateria = () => {
    const nome = (
      document.getElementById('materia') as HTMLInputElement
    ).value.trim();
    const cor = (document.getElementById('cor') as HTMLInputElement).value;
    const dia = (document.getElementById('dia') as HTMLSelectElement).value;
    const hora = (document.getElementById('hora') as HTMLSelectElement).value;

    // Impede matéria diferente com mesma cor
    const corDuplicada = materias.find((m) => m.cor === cor && m.nome !== nome);
    if (corDuplicada) {
      alert(
        `A cor escolhida já está sendo usada pela matéria "${corDuplicada.nome}". Escolha outra cor.`,
      );
      return;
    }

    // Impede conflito de horário no cronograma
    const diaIndex = diasSemana.indexOf(dia);
    const horaIndex = parseInt(hora.split(':')[0], 10) - 7;
    const ocupado = cronograma[horaIndex]?.[diaIndex];

    if (ocupado && ocupado.titulo) {
      alert(
        `Este horário (${dia}, ${hora}) já está ocupado pela matéria "${ocupado.titulo}".`,
      );
      return;
    }

    // Atualiza a matriz do cronograma
    const novaMatriz = [...cronograma];
    novaMatriz[horaIndex][diaIndex] = { titulo: nome, cor };
    setCronograma(novaMatriz);

    // Verifica se já existe a mesma matéria no mesmo dia/hora
    const jaExiste = materias.find(
      (m) => m.nome === nome && m.dia === dia && m.hora === hora,
    );

    if (!jaExiste) {
      setMaterias((prev) => [...prev, { nome, cor, dia, hora }]);
    }

    setMostrarFormulario(false);
  };

  const horasPorDia = diasSemana.map(
    (dia) => materias.filter((m) => m.dia === dia).length,
  );

  const materiasAgrupadas = materias.reduce(
    (acc, curr) => {
      const existente = acc.find((m) => m.nome === curr.nome);
      if (existente) {
        existente.value += 1;
      } else {
        acc.push({ nome: curr.nome, value: 1, cor: curr.cor });
      }
      return acc;
    },
    [] as { nome: string; value: number; cor: string }[],
  );

  return (
    <>
      <main className="flex">
        {/* Menu */}
        <div
          className="fixed top-0 left-0 flex flex-col justify-between gap-4 h-screen w-[300px] bg-cover bg-center"
          style={{
            backgroundImage: "url('/menu.png')",
          }}
        >
          <div className="flex flex-col gap-3">
            {/* Nome e Logo */}
            <div className="pt-3 flex justify-center">
              <h1 className="text-4xl text-white relative font-bold after:content-[''] after:block after:w-[68px] after:h-[2px] after:bg-white after:ml-auto">
                OrgaNotes
              </h1>
              <img src="/logo.png" alt="Logo" className="mt-2 h-8" />
            </div>
            <div className="w-full h-[1px] bg-white"></div>
            {/* Categorias */}
            <div className="px-3 mx-3 text-white bg-[#434561] flex justify-center gap-4 rounded-2xl">
              <Link to={'/Estudos'}>
                <div className="flex hover:text-[#CACCE5] hover:underline transition duration-200 ease-in-out cursor-pointer px-2 py-2 bg-[#3B3D58] rounded-xl">
                  <h1>Estudos</h1>
                </div>
              </Link>

              <Link to={'/Calendar'}>
                <div className="flex  hover:text-[#CACCE5] opacity-65 hover:underline transition duration-200 ease-in-out cursor-pointer px-2 py-2">
                  <h1>Calendário</h1>
                </div>
              </Link>

              <Link to={'/Notes'}>
                <div className="flex hover:text-[#CACCE5] opacity-65 hover:underline transition duration-200 ease-in-out cursor-pointer px-2 py-2">
                  <h1>Notas</h1>
                </div>
              </Link>
            </div>
            <div className="w-full h-[1px] bg-white"></div>
            {/* Barra de Pesquisa */}
            <div className="px-3 py-2 mx-3 text-white bg-[#434561] flex gap-4 rounded-2xl opacity-65 items-center">
              <Search />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-transparent outline-none placeholder-white text-white w-full"
              />
            </div>
            <div className="w-full h-[1px] bg-white"></div>

            {/* Estudos */}
            <div className="mx-3 text-white">
              <button
                onClick={toggle}
                className="px-2 flex items-center gap-2 focus:outline-none"
              >
                <ChevronRight
                  className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                />
                <LibraryBig />
                <h1 className="text-2xl">Estudos</h1>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out rounded-2xl ${
                  isOpen ? 'opacity-100 mt-2' : 'opacity-0'
                }`}
                style={{
                  maxHeight: isOpen ? '240px' : '0px',
                  overflowY: 'auto',
                  background:
                    'linear-gradient(180deg, rgba(71,72,120,0.9), rgba(122,123,194,0.7))',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition:
                    'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out',
                }}
              >
                <div className="py-4 px-4">
                  {diasSemana.map((dia) => {
                    const materiasDoDia = materias
                      .filter((m) => m.dia === dia)
                      .sort((a, b) => {
                        const horaA = parseInt(a.hora.split(':')[0], 10);
                        const horaB = parseInt(b.hora.split(':')[0], 10);
                        return horaA - horaB;
                      });

                    return (
                      <div key={dia} className="mb-4">
                        <h2 className="text-sm font-semibold text-white mb-1">
                          {dia}
                        </h2>

                        {materiasDoDia.length > 0 ? (
                          <ul className="ml-2 text-sm space-y-1">
                            {materiasDoDia.map((materia, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-gray-200"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: materia.cor }}
                                />
                                <span className="font-medium">
                                  {materia.hora}
                                </span>{' '}
                                - <span>{materia.nome}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-xs ml-2">
                            Sem matérias
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé - Menu */}
          <div className="flex flex-col gap-2 px-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[#979ACB] rounded-full">
                <MessageCircleQuestion className="text-white w-5 h-5" />
              </div>
              <span className="text-white transition-all duration-300 group-hover:underline group-hover:text-[#CACCE5]">
                Suporte
              </span>
            </Link>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[#979ACB] rounded-xl">
                <SquareArrowRight className="text-white w-5 h-5" />
              </div>
              <span className="text-white transition-all duration-300 group-hover:underline group-hover:text-[#CACCE5]">
                Sair
              </span>
            </Link>

            <div className="w-full h-[1px] bg-white"></div>

            <div className="flex items-center gap-2 pb-4">
              <Settings className="text-[#979ACB]" />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-2 text-white hover:text-[#CACCE5] transition duration-300"
              >
                <span className="leading-none">Modo Noturno</span>
                <div
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 flex items-center ${
                    darkMode ? 'bg-blue-500' : 'bg-[#979ACB]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      darkMode ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${darkMode ? 'bg-[#1f2130] text-white' : 'bg-white text-black'} min-h-screen w-full ml-[300px]`}
        >
          <div className="flex flex-col gap-2 w-full pb-7">
            <div className="flex justify-between px-6">
              <div className="flex py-4 gap-4 items-center">
                <Menu className="w-5 h-5" />

                <div className="flex items-center gap-1">
                  <LibraryBig />
                  <span className="text-2xl">Estudos</span>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                {mostrarFormulario && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div
                      className={`p-6 rounded shadow-lg w-80 ${
                        darkMode
                          ? 'bg-[#1f2130] text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <h2 className="text-lg font-semibold mb-4">
                        Adicionar Matéria
                      </h2>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSalvarMateria();
                        }}
                        className="flex flex-col gap-3 text-sm"
                      >
                        <div className="flex flex-col">
                          <label
                            htmlFor="materia"
                            className={darkMode ? 'text-white' : 'text-black'}
                          >
                            Matéria
                          </label>
                          <input
                            id="materia"
                            type="text"
                            required
                            className={`p-1 rounded border ${
                              darkMode
                                ? 'bg-[#2f3146] text-white border-[#555774]'
                                : 'bg-white text-black border-[#DADCE0]'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            htmlFor="cor"
                            className={darkMode ? 'text-white' : 'text-black'}
                          >
                            Cor
                          </label>
                          <input
                            id="cor"
                            type="color"
                            required
                            className={`p-1 rounded border ${
                              darkMode
                                ? 'bg-[#2f3146] text-white border-[#555774]'
                                : 'bg-white text-black border-[#DADCE0]'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            htmlFor="dia"
                            className={darkMode ? 'text-white' : 'text-black'}
                          >
                            Dia
                          </label>
                          <select
                            id="dia"
                            required
                            className={`p-1 rounded border ${
                              darkMode
                                ? 'bg-[#2f3146] text-white border-[#555774]'
                                : 'bg-white text-black border-[#DADCE0]'
                            }`}
                          >
                            {diasSemana.map((dia) => (
                              <option key={dia} value={dia}>
                                {dia}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label
                            htmlFor="hora"
                            className={darkMode ? 'text-white' : 'text-black'}
                          >
                            Hora
                          </label>
                          <select
                            id="hora"
                            required
                            className={`p-1 rounded border ${
                              darkMode
                                ? 'bg-[#2f3146] text-white border-[#555774]'
                                : 'bg-white text-black border-[#DADCE0]'
                            }`}
                          >
                            {horarios.map((hora) => (
                              <option key={hora} value={hora}>
                                {hora}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex justify-between mt-3">
                          <button
                            type="button"
                            onClick={() => setMostrarFormulario(false)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Cancelar
                          </button>

                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="flex items-center gap-3 bg-[#434561] py-2 px-3 rounded-lg transition-all duration-300 hover:bg-[#5a5c7a] hover:shadow-md cursor-pointer"
                >
                  <span className="text-white">Adicionar Matéria</span>
                  <Plus className="bg-white text-[#434561] rounded-full w-5 h-5 p-1" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-1 px-6">
              {/* Bloco 1: Pendências */}
              <div
                className={`p-1 rounded border text-[10px] ${
                  darkMode
                    ? 'bg-[#2f3146] border-[#555774] text-white'
                    : 'bg-white border-[#DADCE0] text-black'
                }`}
              >
                <h2 className="flex gap-2 font-semibold mb-2">
                  <BookOpen className="h-5 w-5" /> Assuntos Pendêntes
                </h2>
                <ul className="space-y-0.5">
                  <li className="flex items-center gap-1">
                    <CircleAlert className="h-3 w-3 text-red-500" />
                    Cap. 5 Matemática
                  </li>
                  <li className="flex items-center gap-1">
                    <CircleAlert className="h-3 w-3 text-red-500" />
                    Resumo História
                  </li>
                  <li className="flex items-center gap-1">
                    <CircleAlert className="h-3 w-3 text-red-500" />
                    Redação
                  </li>
                </ul>
              </div>

              {/* Bloco 2: Timer */}
              <div
                className={`p-1 rounded border flex flex-col items-center text-[10px] ${
                  darkMode
                    ? 'bg-[#2f3146] border-[#555774] text-white'
                    : 'bg-white border-[#DADCE0] text-black'
                }`}
              >
                <h2 className="flex gap-2 items-center font-semibold mb-0.5">
                  <Timer className="h-5 w-5" />
                  Timer
                </h2>
                <span className="text-base font-mono mb-1">{tempo}</span>
                <div className="flex gap-1">
                  <button
                    onClick={iniciarTimer}
                    className="bg-green-600 hover:bg-green-700 text-white px-1 py-0.5 rounded text-[10px]"
                  >
                    <Play />
                  </button>
                  <button
                    onClick={pararTimer}
                    className="bg-red-600 hover:bg-red-700 text-white px-1 py-0.5 rounded text-[10px]"
                  >
                    <Pause />
                  </button>

                  <button
                    onClick={resetarTimer}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-1 py-0.5 rounded text-[10px]"
                  >
                    <RotateCcw />
                  </button>
                </div>
              </div>

              {/* Bloco 3: Horas Semanais */}
              <div
                className={`p-1 rounded border text-[10px] ${
                  darkMode
                    ? 'bg-[#2f3146] border-[#555774] text-white'
                    : 'bg-white border-[#DADCE0] text-black'
                }`}
              >
                <h2 className="flex gap-2 items-center font-semibold mb-0.5">
                  <Clock4 className="w-4 h-4" />
                  Horas Semanais
                </h2>
                <div className="w-full h-20 flex items-end gap-[2px]">
                  {diasSemana.map((dia, idx) => {
                    const horas = horasPorDia[idx];
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center w-full relative group"
                      >
                        <div
                          className="bg-blue-600 w-2 rounded cursor-pointer"
                          style={{ height: `${horas * 6}px` }}
                        ></div>

                        {/* Tooltip customizado */}
                        <div className="absolute bottom-full mb-1 px-2 py-1 rounded bg-black text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          {horas} hora{horas !== 1 ? 's' : ''} estudada
                        </div>

                        <span className="text-[8px] mt-[2px]">{dia}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-auto px-2">
              <div className="border border-[#DADCE0] w-full">
                <div
                  className={`grid grid-cols-8 border text-[11px] sm:text-sm ${
                    darkMode
                      ? 'border-[#555774] bg-[#2f3146] text-white'
                      : 'border-[#DADCE0] bg-white text-black'
                  }`}
                >
                  <div className="bg-white text-black p-2 font-bold text-center border-r border-[#DADCE0]">
                    Hora/Dia
                  </div>
                  {diasSemana.map((dia, index) => (
                    <div
                      key={dia}
                      className={`bg-white text-black p-2 font-bold text-center ${
                        index !== diasSemana.length - 1
                          ? 'border-r border-[#DADCE0]'
                          : ''
                      }`}
                    >
                      {dia}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-8 gap-[4px] p-1 w-full text-[11px] sm:text-sm">
                  {horarios.map((hora, i) => (
                    <React.Fragment key={`linha-${i}`}>
                      <div
                        className={`text-xs font-semibold flex items-center justify-center p-1 ${
                          darkMode
                            ? 'bg-[#2f3146] text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        {hora}
                      </div>
                      {cronograma[i].map((celula, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`text-[10px] text-center p-1 truncate rounded shadow-sm ${
                            celula.cor
                              ? ''
                              : darkMode
                                ? 'bg-[#3b3d58] text-white'
                                : 'bg-[#f1f1f1] text-black'
                          }`}
                          style={{ backgroundColor: celula.cor || undefined }}
                        ></div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center items-start mt-6 gap-6">
              {/* Gráfico + Informações da Matéria */}
              <div className="flex p-4 rounded-lg border border-[#DADCE0] gap-6">
                {/* Gráfico de Matérias */}
                <div className="flex items-center gap-6">
                  <PieChart width={160} height={160}>
                    <Pie
                      data={materiasAgrupadas}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      onClick={(data) => {
                        const nome = data.nome;
                        const cor = data.cor;
                        const totalHoras = data.value;
                        setMateriaSelecionada({ nome, cor, totalHoras });
                      }}
                    >
                      {materiasAgrupadas.map((m, i) => (
                        <Cell key={`cell-${i}`} fill={m.cor} cursor="pointer" />
                      ))}
                    </Pie>
                  </PieChart>

                  {/* Legenda */}
                  <div className="flex flex-col text-sm">
                    <span className="font-bold mb-2 text-[#434561]">
                      {materiasAgrupadas.length} MATÉRIAS
                    </span>
                    {materiasAgrupadas.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: m.cor }}
                        />
                        <span>{m.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linha divisória */}
                <div className="w-px bg-[#DADCE0] mx-4 h-[195px]" />

                {/* Informações da Matéria */}
                <div className="w-64 text-sm">
                  <h2 className="text-base font-bold text-[#434561] mb-2">
                    Informações da Matéria
                  </h2>
                  {materiaSelecionada ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: materiaSelecionada.cor }}
                        />
                        <span className="font-medium">
                          {materiaSelecionada.nome}
                        </span>
                      </div>
                      <p>
                        <strong>Horas estudadas:</strong>{' '}
                        {materiaSelecionada.totalHoras}h
                      </p>
                      <p>
                        <strong>Prioridade:</strong> Alta
                      </p>
                      <textarea
                        placeholder="Anotações..."
                        className="w-full mt-2 p-2 border border-gray-300 rounded text-xs resize-none h-20"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">
                      Clique em uma matéria para ver detalhes.
                    </p>
                  )}
                </div>
              </div>

              {/* Quadro de Atividades */}
              <div className="p-4 rounded-lg border border-[#DADCE0] w-72 text-sm">
                <h2 className="text-base font-bold text-[#434561] mb-3">
                  Quadro de Atividades
                </h2>
                {[
                  { nome: 'Atividade 01', cor: '#00BFFF' },
                  { nome: 'Atividade 02', cor: '#00C49F' },
                  { nome: 'Atividade 03', cor: '#8884D8' },
                  { nome: 'Atividade 04', cor: '#FFBB28' },
                ].map((atv, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{`0${idx + 1}`}</span>
                      <span>{atv.nome}</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `0%`,
                          backgroundColor: atv.cor,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Estudos;
