const {getAllApartments, getApartmentById, addApartment, editApartment, deleteApartment} = require("../services/apartment");


exports.getAllApartments=getAllApartments;

exports.getApartmentById=getApartmentById;

exports.addApartment=addApartment;

exports.editApartment=editApartment;

exports.deleteApartment=deleteApartment;
