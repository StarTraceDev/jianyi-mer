class CanvasNest {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private points: Point[] = [];
  private animationId: number = 0;
  private mousePoint: Point = { x: null, y: null, max: 20000 };

  constructor(
    private container: HTMLElement,
    private config: {
      zIndex?: string;
      opacity?: number;
      color?: string;
      count?: number;
    } = {}
  ) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not supported');
    this.ctx = ctx;

    this.initCanvas();
    this.initPoints();
    this.bindEvents();
    this.animate();
  }

  private initCanvas() {
    const {
      zIndex = '-2',
      opacity = '0.8'
    } = this.config;

    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: ${zIndex};
      opacity: ${opacity};
      pointer-events: none;
    `;

    this.container.appendChild(this.canvas);
    this.resize();
  }

  private resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  private initPoints() {
    const { count = 240 } = this.config;

    for (let i = 0; i < count; i++) {
      this.points.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        xa: 2 * Math.random() - 1,
        ya: 2 * Math.random() - 1,
        max: 6000
      });
    }
  }

  private bindEvents() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseout', this.handleMouseOut);
  }

  private unbindEvents() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseout', this.handleMouseOut);
  }

  private handleResize = () => {
    this.resize();
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mousePoint.x = e.clientX;
    this.mousePoint.y = e.clientY;
  }

  private handleMouseOut = () => {
    this.mousePoint.x = null;
    this.mousePoint.y = null;
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const allPoints = [this.mousePoint, ...this.points];
    const { color = '255,255,255' } = this.config;

    this.points.forEach(point => {
      if (point.x !== null && point.y !== null && point.xa !== undefined && point.ya !== undefined) {
        point.x += point.xa;
        point.y += point.ya;

        point.xa *= point.x > this.width || point.x < 0 ? -1 : 1;
        point.ya *= point.y > this.height || point.y < 0 ? -1 : 1;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(point.x - 0.5, point.y - 0.5, 2, 2);

        allPoints.forEach(otherPoint => {
          if (
            point !== otherPoint &&
            point.x !== null &&
            point.y !== null &&
            otherPoint.x !== null &&
            otherPoint.y !== null &&
            otherPoint.max !== undefined
          ) {
            const dx = point.x - otherPoint.x;
            const dy = point.y - otherPoint.y;
            const distance = dx * dx + dy * dy;

            if (distance < otherPoint.max) {
              if (otherPoint === this.mousePoint && distance >= otherPoint.max / 2) {
                point.x -= 0.03 * dx;
                point.y -= 0.03 * dy;
              }
              const opacity = (otherPoint.max - distance) / otherPoint.max;
              this.ctx.beginPath();
              this.ctx.lineWidth = opacity / 2;
              this.ctx.strokeStyle = `rgba(${color},${opacity + 0.2})`;
              this.ctx.moveTo(point.x, point.y);
              this.ctx.lineTo(otherPoint.x, otherPoint.y);
              this.ctx.stroke();
            }
          }
        });
      }
    });
  }

  public destroy() {
    cancelAnimationFrame(this.animationId);
    this.unbindEvents();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

interface Point {
  x: number | null;
  y: number | null;
  xa?: number;
  ya?: number;
  max?: number;
}

export default CanvasNest;
