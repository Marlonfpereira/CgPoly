function fillPolygon() {
    const initialY = polygon.minY;
    const endY = polygon.maxY;
    const intersections = polygon.intersections;

    for (let currentY = initialY; currentY < endY; currentY++) {
        const currentPoint = intersections.get(currentY);
        let k = 0;

        do {
            let firstX = currentPoint[k];
            let endX = currentPoint[k + 1];

            for (let currentX = firstX; currentX < endX; currentX++)
                point(currentX, currentY);

            k += 2;
        } while (currentPoint[k]);
    }
}