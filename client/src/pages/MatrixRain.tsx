import React, { useRef, useEffect } from 'react';

const FONT_SIZE = 16;
const MATRIX_COLOR = '#00FFFF'; // Màu xanh Cyan cổ điển cho hiệu ứng số hóa

interface MatrixRainProps {
  color?: string;
  speed?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ color = MATRIX_COLOR, speed = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      // Đảm bảo Canvas lấp đầy phần tử cha
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();

    // Thêm ResizeObserver để xử lý khi kích thước phần tử cha thay đổi
    const resizeObserver = new ResizeObserver(setCanvasSize);
    resizeObserver.observe(canvas);

    const characters = '01';
    let columns = Math.floor(canvas.width / FONT_SIZE);

    let drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    let interval: number;

    const draw = () => {
      // Cập nhật lại số cột nếu kích thước thay đổi
      if (columns !== Math.floor(canvas.width / FONT_SIZE)) {
        columns = Math.floor(canvas.width / FONT_SIZE);
        drops = [];
        for (let i = 0; i < columns; i++) {
          drops[i] = 1;
        }
      }

      // Tô nền đen mờ (tạo hiệu ứng vệt mờ - trail effect)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Thiết lập màu và font chữ
      ctx.fillStyle = color;
      ctx.font = `${FONT_SIZE}px monospace`;

      // Vẽ và cập nhật vị trí giọt nước
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];

        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        ctx.fillText(text, x, y);

        // Đặt lại giọt nước về đầu màn hình nếu rơi hết
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    interval = setInterval(draw, speed) as unknown as number;

    return () => {
      clearInterval(interval);
      resizeObserver.unobserve(canvas); // Xóa observer
    };
  }, [color, speed]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default MatrixRain;
