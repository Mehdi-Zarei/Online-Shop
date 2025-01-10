const provinces = require("../../../Cities/provinces.json");
const cities = require("../../../Cities/cities.json");

exports.getProvinces = async (req, res, next) => {
  try {
    const filteredProvinces = provinces.map((province) => ({
      id: province.id,
      name: province.name,
    }));

    res.status(200).json(filteredProvinces);
  } catch (error) {
    next();
  }
};

exports.getCitiesByProvince = async (req, res, next) => {
  try {
    const provinceID = parseInt(req.params.provinceID, 10);

    const relatedCities = cities.filter(
      (city) => city.province_id === provinceID
    );

    if (relatedCities.length === 0) {
      return res
        .status(404)
        .json({ message: "No cities found for this province" });
    }

    const filteredCities = relatedCities.map((city) => ({
      id: city.id,
      name: city.name,
      province_id: city.province_id,
    }));

    res.status(200).json(filteredCities);
  } catch (error) {
    next();
  }
};
