import DeviceCard from "../components/DeviceCard";

const dummyDevices = [
  {
    id: 1,
    name: "Dell Latitude 5420",
    description: "Erős üzleti laptop projektmunkákhoz.",
    imageUrl: "laptop.jpg"
  },
  {
    id: 2,
    name: "Epson EB-X06 Projektor",
    description: "Prezentációkhoz ideális, nagy fényerejű projektor.",
    imageUrl: "projector.jpg"
  },
  {
    id: 3,
    name: "Canon EOS 250D Kamera",
    description: "Fotózáshoz és videózáshoz, profi minőség.",
    imageUrl: "camera.jpg"
  }
];

export default function DeviceListPage() {
  return (
    <div style={{ padding: "20px" }}>
    <h2 style={{textAlign: "center"}}>Elérhető eszközök</h2>
        
                
                            <div style={{
                    padding: "20px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center"
                    }}>

                    

                    {dummyDevices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                    ))}
                </div>



    </div>
  );
}
