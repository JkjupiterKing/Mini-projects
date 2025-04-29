package com.supplychainmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supplychainmanagement.model.PurchaseOrders;
import com.supplychainmanagement.repo.PurchaseOrdersRepo;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class PurchaseOrdersController {

    @Autowired
    private PurchaseOrdersRepo purchaseOrdersRepository;

    @GetMapping("/getAllPurchaseOrders")
    public ResponseEntity<List<PurchaseOrders>> getAllPurchaseOrders() {
        try {
            List<PurchaseOrders> purchaseOrdersList = purchaseOrdersRepository.findAll();

            if (purchaseOrdersList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(purchaseOrdersList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPurchaseOrderById/{id}")
    public ResponseEntity<PurchaseOrders> getPurchaseOrderById(@PathVariable Long id) {
        Optional<PurchaseOrders> purchaseOrderData = purchaseOrdersRepository.findById(id);

        return purchaseOrderData.map(purchaseOrder ->
                        new ResponseEntity<>(purchaseOrder, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/addPurchaseOrder")
    public ResponseEntity<PurchaseOrders> addPurchaseOrder(@RequestBody PurchaseOrders purchaseOrder) {
        try {
            PurchaseOrders savedPurchaseOrder = purchaseOrdersRepository.save(purchaseOrder);
            return new ResponseEntity<>(savedPurchaseOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updatePurchaseOrderById/{id}")
    public ResponseEntity<PurchaseOrders> updatePurchaseOrderById(@PathVariable Long id, @RequestBody PurchaseOrders purchaseOrder) {
        Optional<PurchaseOrders> oldPurchaseOrderData = purchaseOrdersRepository.findById(id);

        if (oldPurchaseOrderData.isPresent()) {
            PurchaseOrders updatedPurchaseOrder = oldPurchaseOrderData.get();
            updatedPurchaseOrder.setItem(purchaseOrder.getItem());
            updatedPurchaseOrder.setQuantity(purchaseOrder.getQuantity());
            updatedPurchaseOrder.setSupplier(purchaseOrder.getSupplier());
            updatedPurchaseOrder.setPrice(purchaseOrder.getPrice());

            PurchaseOrders savedPurchaseOrder = purchaseOrdersRepository.save(updatedPurchaseOrder);
            return new ResponseEntity<>(savedPurchaseOrder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/deletePurchaseOrderById/{id}")
    public ResponseEntity<HttpStatus> deletePurchaseOrderById(@PathVariable Long id) {
        try {
            purchaseOrdersRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/getPurchaseOrdersBySupplier/{supplier}")
    public ResponseEntity<List<PurchaseOrders>> getPurchaseOrdersBySupplier(@PathVariable String supplier) {
        List<PurchaseOrders> purchaseOrdersList = purchaseOrdersRepository.findBySupplier(supplier);

        if (purchaseOrdersList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(purchaseOrdersList, HttpStatus.OK);
    }
}
