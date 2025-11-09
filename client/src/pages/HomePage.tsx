import MatrixRain from './MatrixRain';

function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-black relative text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('./assets/background.png')] bg-no-repeat bg-center bg-contain opacity-70 z-1" />
      <MatrixRain color="#8D0000" speed={50} />

      <div className="relative z-10 text-center max-w-3xl px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          EXPLORE WONDERFUL ITEMS <br /> WITH REASONABLE PRICES
        </h1>
        <button className="bg-white text-[#8D0000] px-6 py-2 rounded font-semibold hover:bg-gray-100">
          Auction now!
        </button>
      </div>
    </div>
  );
}

export default HomePage;
