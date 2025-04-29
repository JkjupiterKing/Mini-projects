package com.supplychainmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supplychainmanagement.model.Supplier;
import com.supplychainmanagement.repo.SupplierRepo;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class SupplierController {

    @Autowired
    private SupplierRepo supplierRepository;

    @GetMapping("/getAllSuppliers")
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        try {
            List<Supplier> supplierList = supplierRepository.findAll();

            if (supplierList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(supplierList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSupplierById/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Optional<Supplier> supplierData = supplierRepository.findById(id);

        return supplierData.map(Supplier ->
                        new ResponseEntity<>(Supplier, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/addSupplier")
    public ResponseEntity<Supplier> addSupplier(@RequestBody Supplier supplier) {
        try {
            Supplier savedSupplier = supplierRepository.save(supplier);
            return new ResponseEntity<>(savedSupplier, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateSupplierById/{id}")
    public ResponseEntity<Supplier> updateSupplierById(@PathVariable Long id, @RequestBody Supplier updatedSupplier) {
        Optional<Supplier> oldSupplierData = supplierRepository.findById(id);

        if (oldSupplierData.isPresent()) {
            Supplier existingSupplier = oldSupplierData.get();
            existingSupplier.setName(updatedSupplier.getName());
            existingSupplier.setContactPerson(updatedSupplier.getContactPerson());
            existingSupplier.setEmail(updatedSupplier.getEmail());
            existingSupplier.setPhone(updatedSupplier.getPhone());
            existingSupplier.setAddress(updatedSupplier.getAddress());
            existingSupplier.setPassword(updatedSupplier.getPassword());

            Supplier savedSupplier = supplierRepository.save(existingSupplier);
            return new ResponseEntity<>(savedSupplier, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deleteSupplierById/{id}")
    public ResponseEntity<HttpStatus> deleteSupplierById(@PathVariable Long id) {
        try {
            supplierRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSupplierByEmail/{email}")
    public ResponseEntity<Supplier> getSupplierByEmail(@PathVariable String email) {
        Optional<Supplier> supplierData = supplierRepository.findByEmail(email);

        return supplierData.map(supplier ->
                        new ResponseEntity<>(supplier, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
