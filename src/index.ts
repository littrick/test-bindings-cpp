import { SerialPort } from 'serialport';

async function GetPortList() {
    const ports = (await SerialPort.list()).filter(
        port => !port.pnpId?.startsWith('BTHENUM')
    );
    console.log("Available ports: ", { prots: ports });
    return ports;
}


async function test_read() {
    let ports = await GetPortList();
    if (ports.length === 0) {
        console.log("No ports available");
        return;
    }

    let port = new SerialPort({
        path: ports[0].path,
        baudRate: 115200
    });

    var count = 1;
    port.on('data', (data: Buffer) => {
        console.log(`Data received(${count}): `, data.toString());
        count++;
        if (count > 5) {
            port.close();
        }
    });


    port.write("Hello, Serial Port!", (err: any) => {
        if (err) {
            console.error("Error writing to port: ", err);
        } else {
            console.log("Message written to port");
        }
    });
    console.log("Port opened: " + ports[0].path);
}

test_read().catch((err) => {
    console.error("Error: ", err);
});