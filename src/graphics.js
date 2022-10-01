export const graphicsCache = {
    Line: {},
    Rectangle: {},
    Circle: {}
};
export default function graphics() {
    let cacheCtx;
    this.getLine = function (len, color) {
        let graph;
        if (graphicsCache.Line[len]) {
            graph = graphicsCache.Line[len][color];
            if (graph) {
                return graph
            }
        } else {
            graphicsCache.Line[len] = {}
        }
        graph = document.createElement("canvas");
        graph.width = 1;
        graph.height = len;
        graphicsCache.Line[len][color] = graph
        cacheCtx = graph.getContext("2d");
        cacheCtx.save();
        cacheCtx.strokeStyle = color;
        cacheCtx.beginPath();
        cacheCtx.moveTo(0, 0);
        cacheCtx.lineTo(0, len);
        cacheCtx.stroke();
        cacheCtx.restore()
        return graph
    }
    this.getRectangle = function (xs, ys, color) {
        let graph;
        if (graphicsCache.Rectangle[xs]) {
            if (graphicsCache.Rectangle[xs][ys]) {
                graph = graphicsCache.Rectangle[xs][ys][color];
                if (graph) {
                    return graph
                }
            } else {
                graphicsCache.Rectangle[xs][ys] = {}
            }
        } else {
            graphicsCache.Rectangle[xs] = {}
            graphicsCache.Rectangle[xs][ys] = {}
        }
        graph = document.createElement("canvas");
        graph.width = xs + xs + 2;
        graph.height = ys + ys + 2;
        graphicsCache.Rectangle[xs][ys][color] = graph
        cacheCtx = graph.getContext("2d");
        cacheCtx.strokeStyle = color;
        cacheCtx.strokeRect(1, 1, xs, ys);
        cacheCtx.restore()
        return graph
    }
    this.getCircle = function (r, color) {
        let graph;
        if (graphicsCache.Circle[r]) {
            graph = graphicsCache.Circle[r][color]
            if (graph) {
                return graph
            }
        } else {
            graphicsCache.Circle[r] = {}
        }
        graph = document.createElement("canvas");
        graph.width = r + r + 2;
        graph.height = r + r + 2;
        graphicsCache.Circle[r][color] = graph
        cacheCtx = graph.getContext("2d");
        cacheCtx.save();
        cacheCtx.strokeStyle = color;
        cacheCtx.beginPath();
        cacheCtx.arc(r + 1, r + 1, r, 0, Math.PI * 2);
        cacheCtx.stroke();
        cacheCtx.restore()
        return graph
    }
}