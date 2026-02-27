import { useState, useEffect, useCallback } from "react";
import { DataTable } from "mantine-datatable";
import {
  Select,
  Button,
  TextInput,
  Group,
  ActionIcon,
  Badge,
  Modal,
  Switch,
} from "@mantine/core";
import { IconSearch, IconEdit, IconTrash } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { useAuth } from "../../context/Context.js";

const PAGE_SIZE = 10;

const Users = () => {
  const {
    tokenInfo, // <-- This is an ARRAY of projects
    getAllProjectUsers,
    updateProjectUser,
    deleteProjectUser,
    createProjectUser,
    bulkUpdateProjectUsers,
    bulkDeleteProjectUsers,
  } = useAuth();

  const [selectedProject, setSelectedProject] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [status, setStatus] = useState(null);

  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "createdAt",
    direction: "desc",
  });

  /* ================= MODAL STATES ================= */

  const [editOpened, setEditOpened] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [createOpened, setCreateOpened] = useState(false);
  const [createUser, setCreateUser] = useState({
    name: "",
    email: "",
    password: "",
    isActive: true,
  });

  const [bulkEditOpened, setBulkEditOpened] = useState(false);
  const [bulkData, setBulkData] = useState({
    isActive: true,
  });

  /* ================= FETCH USERS ================= */

  const fetchUsers = useCallback(
    async (pageNumber = 1) => {
      if (!selectedProject) return;

      try {
        setLoading(true);

        const data = await getAllProjectUsers(
          selectedProject,
          pageNumber,
          PAGE_SIZE,
          debouncedSearch || undefined,
          sortStatus.columnAccessor,
          sortStatus.direction,
          status || undefined,
        );

        setRecords(data?.users || []);
        setTotalRecords(data?.meta?.total || 0);
        setPage(pageNumber);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [selectedProject, debouncedSearch, status, sortStatus, getAllProjectUsers],
  );

  useEffect(() => {
    if (selectedProject) fetchUsers(1);
  }, [selectedProject, debouncedSearch, status, sortStatus, fetchUsers]);

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;

    await deleteProjectUser(selectedProject, userId);
    fetchUsers(page);
  };

  /* ================= BULK DELETE ================= */

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected users?")) return;

    const ids = selectedRecords.map((r) => r._id);

    await bulkDeleteProjectUsers(selectedProject, ids);

    setSelectedRecords([]);
    fetchUsers(page);
  };

  /* ================= EDIT ================= */

  const handleEditOpen = (record) => {
    setEditUser({ ...record });
    setEditError("");
    setEditOpened(true);
  };

  const handleSaveEdit = async () => {
    try {
      setEditLoading(true);

      await updateProjectUser(selectedProject, editUser._id, {
        name: editUser.name,
        email: editUser.email,
        isActive: editUser.isActive,
      });

      setEditOpened(false);
      fetchUsers(page);
    } catch (error) {
      setEditError(error.response?.data?.message || "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  /* ================= CREATE (FIXED HERE) ================= */

  const handleCreate = async () => {
    try {
      if (!selectedProject) {
        alert("Please select a project first.");
        return;
      }

      await createProjectUser(selectedProject, createUser);

      setCreateOpened(false);
      setCreateUser({
        name: "",
        email: "",
        password: "",
        isActive: true,
      });

      fetchUsers(1);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Create failed");
    }
  };

  /* ================= BULK UPDATE ================= */

  const handleBulkUpdate = async () => {
    const ids = selectedRecords.map((r) => r._id);

    await bulkUpdateProjectUsers(selectedProject, ids, bulkData);

    setBulkEditOpened(false);
    setSelectedRecords([]);
    fetchUsers(page);
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <h2 className="text-xl font-semibold mb-6 text-white">Project Users</h2>

      {/* 🔥 Project Selector */}
      <Select
        placeholder="Select Project"
        data={
          tokenInfo?.map((p) => ({
            value: p.id || p._id,
            label: p.name,
          })) || []
        }
        value={selectedProject}
        onChange={(value) => {
          setSelectedProject(value);
          setPage(1);
          setRecords([]);
        }}
        mb="md"
      />

      {selectedProject && (
        <>
          <Group mb="md">
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />

            <Select
              placeholder="Filter Status"
              data={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              value={status}
              onChange={setStatus}
              clearable
            />

            <Button onClick={() => setCreateOpened(true)}>Create User</Button>

            {/* {selectedRecords.length > 0 && (
              <>
                <Button color="blue" onClick={() => setBulkEditOpened(true)}>
                  Bulk Edit ({selectedRecords.length})
                </Button>

                <Button color="red" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </>
            )} */}
          </Group>

          <DataTable
            idAccessor="_id"
            striped
            highlightOnHover
            fetching={loading}
            records={records}
            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={setSelectedRecords}
            columns={[
              { accessor: "name", sortable: true },
              { accessor: "email", sortable: true },
              {
                accessor: "createdAt",
                title: "Created",
                sortable: true,
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
              {
                accessor: "isActive",
                title: "Status",
                render: (r) => (
                  <Badge color={r.isActive ? "green" : "red"}>
                    {r.isActive ? "Active" : "Inactive"}
                  </Badge>
                ),
              },
              {
                accessor: "actions",
                title: "Actions",
                render: (r) => (
                  <Group gap={4}>
                    <ActionIcon color="blue" onClick={() => handleEditOpen(r)}>
                      <IconEdit size={16} />
                    </ActionIcon>

                    <ActionIcon color="red" onClick={() => handleDelete(r._id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            totalRecords={totalRecords}
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => fetchUsers(p)}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
          />
        </>
      )}

      {/* EDIT MODAL */}
      <Modal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Edit User"
        centered
      >
        {editUser && (
          <>
            <TextInput
              label="Name"
              value={editUser.name}
              onChange={(e) =>
                setEditUser({
                  ...editUser,
                  name: e.currentTarget.value,
                })
              }
              mb="md"
            />

            <TextInput
              label="Email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({
                  ...editUser,
                  email: e.currentTarget.value,
                })
              }
              mb="md"
            />

            <Switch
              label="Active"
              checked={editUser.isActive}
              onChange={(e) =>
                setEditUser({
                  ...editUser,
                  isActive: e.currentTarget.checked,
                })
              }
              mb="md"
            />

            {editError && <p style={{ color: "red" }}>{editError}</p>}

            <Group justify="flex-end">
              <Button onClick={handleSaveEdit}>Save</Button>
            </Group>
          </>
        )}
      </Modal>

      {/* CREATE MODAL */}
      <Modal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        title="Create User"
        centered
      >
        <TextInput
          label="Name"
          value={createUser.name}
          onChange={(e) =>
            setCreateUser({
              ...createUser,
              name: e.currentTarget.value,
            })
          }
        />

        <TextInput
          label="Email"
          mt="md"
          value={createUser.email}
          onChange={(e) =>
            setCreateUser({
              ...createUser,
              email: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Password"
          mt="md"
          value={createUser.password}
          onChange={(e) =>
            setCreateUser({
              ...createUser,
              password: e.currentTarget.value,
            })
          }
        />

        <Switch
          label="Active"
          mt="md"
          checked={createUser.isActive}
          onChange={(e) =>
            setCreateUser({
              ...createUser,
              isActive: e.currentTarget.checked,
            })
          }
        />

        <Group justify="flex-end" mt="md">
          <Button onClick={handleCreate}>Create</Button>
        </Group>
      </Modal>

      {/* BULK EDIT MODAL */}
      <Modal
        opened={bulkEditOpened}
        onClose={() => setBulkEditOpened(false)}
        title="Bulk Edit Users"
        centered
      >
        <Switch
          label="Set Active Status"
          checked={bulkData.isActive}
          onChange={(e) =>
            setBulkData({
              ...bulkData,
              isActive: e.currentTarget.checked,
            })
          }
        />

        <Group justify="flex-end" mt="md">
          <Button onClick={handleBulkUpdate}>Apply Changes</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default Users;
