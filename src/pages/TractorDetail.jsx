import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTractorById } from "../services/tractorservice";
import Card from "../component/cards/Card";



const TractorDetail = () => {
  const { id } = useParams();
  const [tractor, setTractor] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetchTractor();
    fetchRelated();
  }, [id]);

  const fetchTractor = async () => {
    try {
      const res = await getTractorById(id);
      setTractor(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelated = async () => {
    try {
      const res = await getTractors(0, 4);
      setRelated(res.content);
    } catch (err) {
      console.error(err);
    }
  };

  if (!tractor) {
    return <div className="p-6">Loading...</div>;
  }

  const spec = tractor.specification;

  const mainImage = tractor.images.find(
    (img) => img.imageType === "MAIN"
  );
  const gallery = tractor.images.filter(
    (img) => img.imageType === "GALLERY"
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        {tractor.brand} {tractor.model}
      </h1>

      {/* IMAGE SECTION */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <img
          src={mainImage?.imageUrl}
          alt={tractor.model}
          className="w-full md:w-1/2 rounded-xl shadow"
        />

        <div className="flex flex-wrap gap-3">
          {gallery.map((img, i) => (
            <img
              key={i}
              src={img.imageUrl}
              alt="gallery"
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <InfoBox label="Brand" value={tractor.brand} />
        <InfoBox label="HP" value={`${tractor.hp} HP`} />
        <InfoBox
          label="Price"
          value={`₹ ${tractor.price.toLocaleString()}`}
          highlight
        />
      </div>

      {/* SPECIFICATIONS */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>

        <div className="space-y-8">

          {/* Engine */}
          <SpecGroup title="Engine & Performance">
            <SpecItem label="Cylinder" value={spec.cylinder} />
            <SpecItem label="Engine Capacity" value={`${spec.engineCapacity} cc`} />
            <SpecItem label="Torque" value={`${spec.torque} Nm`} />
            <SpecItem label="Backup Torque" value={`${spec.backupTorque} Nm`} />
          </SpecGroup>

          {/* Transmission */}
          <SpecGroup title="Transmission">
            <SpecItem label="Clutch" value={spec.clutch} />
            <SpecItem label="Gearbox" value={spec.gearbox} />
          </SpecGroup>

          {/* Control */}
          <SpecGroup title="Control & Brakes">
            <SpecItem label="Steering" value={spec.steering} />
            <SpecItem label="Brakes" value={spec.brakes} />
          </SpecGroup>

          {/* PTO */}
          <SpecGroup title="PTO">
            <SpecItem label="PTO HP" value={spec.ptoHp} />
            <SpecItem label="PTO Options" value={spec.ptoOptions} />
          </SpecGroup>

          {/* Tyres */}
          <SpecGroup title="Tyres & Axles">
            <SpecItem label="Front Tyre" value={spec.frontTyre} />
            <SpecItem label="Rear Tyre" value={spec.rearTyre} />
            <SpecItem label="Front Axle" value={spec.frontAxle} />
            <SpecItem label="Rear Axle" value={spec.rearAxle} />
          </SpecGroup>

          {/* Maintenance */}
          <SpecGroup title="Maintenance">
            <SpecItem
              label="Service Interval"
              value={`${spec.serviceInterval} hrs`}
            />
          </SpecGroup>

        </div>
      </div>

      {/* RELATED TRACTORS */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Related Tractors</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {related
            .filter((t) => t.id !== tractor.id)
            .map((item) => (
              <Card key={item.id} data={item} />
            ))}
        </div>
      </div>

    </div>
  );
};







/* ================= COMPONENTS ================= */

const InfoBox = ({ label, value, highlight }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-semibold ${highlight ? "text-green-600" : ""}`}>
        {value}
      </p>
    </div>
  );
};

const SpecGroup = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

const SpecItem = ({ label, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "N/A"}</p>
    </div>
  );
};

export default TractorDetail;