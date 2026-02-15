import { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Select, Button, TextInput, Group, ActionIcon } from "@mantine/core";
import { IconSearch, IconEdit, IconTrash } from "@tabler/icons-react";
import { useAuth } from "../../context/Context.js";

const PAGE_SIZE = 10;

const Users = () => {
  const { tokenInfo, getAllProjectUsers } = useAuth();

  const [selectedProject, setSelectedProject] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "createdAt",
    direction: "desc",
  });

  const fetchUsers = async (pageNumber = page) => {
    if (!selectedProject) return;

    try {
      setLoading(true);

      const data = await getAllProjectUsers(
        selectedProject,
        pageNumber,
        PAGE_SIZE,
        search,
        sortStatus.columnAccessor,
        sortStatus.direction,
        status,
      );

      setRecords(data?.users || []);
      setTotalRecords(data?.meta?.total || 0);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchUsers(1);
    }
  }, [search, sortStatus, status]);

  return (
    <div className=" bg-slate-950 min-h-screen">
      <h2 className="text-xl font-semibold mb-6 text-white">Project Users</h2>

      {/* Project Select */}
      <Select
        placeholder="Select Project"
        data={
          tokenInfo?.map((project) => ({
            value: project.id,
            label: project.name,
          })) || []
        }
        value={selectedProject}
        onChange={(value) => {
          setSelectedProject(value);
          setPage(1);
        }}
        mb="md"
      />

      {selectedProject && (
        <>
          {/* Search + Filter */}
          <Group mb="md">
            <TextInput
              placeholder="Search name or email..."
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

            <Button onClick={() => fetchUsers(1)}>Refresh</Button>
          </Group>

          <DataTable
            withBorder
            highlightOnHover
            striped
            fetching={loading}
            records={records}
            columns={[
              {
                accessor: "name",
                sortable: true,
              },
              {
                accessor: "email",
                sortable: true,
              },
              {
                accessor: "createdAt",
                title: "Created",
                sortable: true,
                render: (record) => new Date(record.createdAt).toLocaleString(),
              },
              {
                accessor: "isActive",
                title: "Status",
                render: (record) => (record.isActive ? "Active" : "Inactive"),
              },
              {
                accessor: "actions",
                title: "Actions",
                render: (record) => (
                  <Group gap={4}>
                    <ActionIcon
                      color="blue"
                      onClick={() => {
                        console.log("Edit", record._id);
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>

                    <ActionIcon
                      color="red"
                      onClick={() => {
                        console.log("Delete", record._id);
                      }}
                    >
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
    </div>
  );
};

export default Users;
