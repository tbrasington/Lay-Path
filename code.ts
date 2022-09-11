// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.

  const components = findComponents(figma.root);
  components.map((component: ComponentNode) => {
    console.log(component.name);
  });

  const totalColumns = 6;
  const totalRows = 24;

  const options = [0, -180, -90, 90, 180];
  function addColumn(
    canvas: FrameNode,
    component: ComponentNode,
    currentColumn: number,
    currentRow: number
  ) {
    const node = component.createInstance();
    node.x = currentColumn * 210 - 75;
    node.y = currentRow * 210;

    canvas.appendChild(node);

    const tx = node.x;
    const ty = node.y;
    const x = node.width / 2;
    const y = node.height / 2;
    const angle = options[Math.floor(Math.random() * 4) + 1];
    const radians = (angle * Math.PI) / 180;
    const transformX = x - x * Math.cos(radians) + y * Math.sin(radians);
    const transformY = y - x * Math.sin(radians) - y * Math.cos(radians);

    console.log({ x, y, tx, ty, transformX, transformY, angle });

    node.relativeTransform = [
      [Math.cos(radians), -Math.sin(radians), transformX],
      [Math.sin(radians), Math.cos(radians), transformY],
    ];
    // node.rotation = angle
    node.x = tx + node.x;
    node.y = ty + node.y;
  }
  if (msg.type === "create-rectangles") {
    // add a component
    const canvas = figma.createFrame();
    canvas.resize(1100, 5000);
    canvas.name = "Canvas";
    figma.currentPage.appendChild(canvas);

    for (let i = 0; i < totalColumns; i++) {
      for (let j = 0; j < totalRows; j++) {
        const position = Math.floor(
          Math.random() * (components.length - 1 - 0 + 1) + 0
        );
        const tile = components[position];
        addColumn(canvas, tile, i, j);
      }
    }

    // const nodes: SceneNode[] = [];
    // for (let i = 0; i < msg.count; i++) {
    //   const rect = figma.createRectangle();
    //   rect.x = i * 150;
    //   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
    //   figma.currentPage.appendChild(rect);
    //   nodes.push(rect);
    // }
    // figma.currentPage.selection = nodes;
    // figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};

function findComponents(node: DocumentNode) {
  // Finds all component and component set nodes
  const nodes = node.findAllWithCriteria({
    types: ["COMPONENT"],
  });

  const justTiles = nodes.filter((node) => {
    return (
      node.name == "Tile 1" || node.name == "Tile 2" || node.name == "Tile 3"
    );
  });
  return justTiles;
}
