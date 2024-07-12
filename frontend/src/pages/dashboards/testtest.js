 <TableCell
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      padding: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Button>
                        <Link
                          to={`/EditUserDetails/${id}/details?dataId=${index}`}
                          style={{ textDecoration: "none" }}
                        >
                          <EditIcon style={{ color: "blue" }} />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => {
                          const isConfirmed = window.confirm(
                            "Are you sure you want to delete?"
                          );
                          if (isConfirmed) {
                            handleDeleteRecord(item.id);
                          }
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </div>
                  </TableCell> 