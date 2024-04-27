const Equipment = require('../models/Equipment'); // Assuming you have the Equipment model

// Add Equipment
const addEquipments = async (req, res) => {
  try {
    const equipmentsData = req.body; // Assuming req.body is an array of JSON objects
    console.log(req.body);
    // Iterate over each equipment data
    const createdEquipments = [];
    for (const equipmentData of equipmentsData) {
      const { name, lab, description, link, quantity, allotmentDays, type } = equipmentData;

      if (lab !== req.lab) {
        return res.status(401).json({ message: 'Unauthorized - Lab mismatch' });
      }

      const newEquipment = new Equipment({ name, lab, description, link, quantity, allotmentDays, type });
      await newEquipment.save();
      createdEquipments.push(newEquipment);
    }

    res.status(201).json({ message: 'Equipment(s) created successfully', equipments: createdEquipments });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while adding the equipment' });
  }
};


// Retrieve Equipment by Lab
const getEquipmentsByLab = async (req, res) => {
  try {
    const labName = req.params.labName;
    const equipmentList = await Equipment.find({ lab: labName });
    res.json(equipmentList);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching equipment data by lab' });
  }
};

// Retrieve All Equipment
const getAllEquipments = async (req, res) => {
  try {
    const allEquipment = await Equipment.find();
    res.json(allEquipment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching all equipment' });
  }
};

// Update Equipment by ID
const updateEquipments = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const { name, lab, description, link, quantity, allotmentDays } = req.body;
    if (lab !== req.lab) {
      return res.status(401).json({ message: 'Unauthorized - Lab mismatch' });
    }
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      { name, lab, description, link, quantity, allotmentDays },
      { new: true }
    );
    res.json({ message: 'Equipment updated successfully', equipment: updatedEquipment });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the equipment' });
  }
};

// Delete Equipment by ID
const deleteEquipments = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    await Equipment.findByIdAndRemove(equipmentId);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the equipment' });
  }
};


module.exports = { deleteEquipments, getEquipmentsByLab, addEquipments, updateEquipments, getAllEquipments};
